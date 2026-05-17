import axios from "axios";
import Product from "../model/productModel.js";
import Order from "../model/orderModel.js";
import User from "../model/userModel.js"
import crypto from "crypto";
import Coupon from "../model/couponModel.js";
import { sendOrderEmailToAdmin, sendOrderEmailToUser } from "../lib/utils/sendOrderEmail.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PURCHASE_LOYALTY_POINTS = 15;
const REFERRER_BONUS_POINTS = 100;
const REFERRED_CUSTOMER_BONUS_POINTS = 50;

export const paystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    const rawBody = req.body.toString();

    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      return res.status(401).send("Invalid signature");
    }

    const event = JSON.parse(rawBody);

    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const payment = event.data;

    if (payment.status !== "success") {
      return res.sendStatus(200);
    }

    const reference = payment.reference;

    // 🔥 ✅ CRITICAL FIX: prevent duplicate order
    const existingOrder = await Order.findOne({
      paymentReference: reference,
    });

    if (existingOrder) {
      console.log("⚠️ Duplicate webhook ignored:", reference);
      return res.sendStatus(200); // VERY IMPORTANT
    }

    const {
      items,
      userId,
      phone,
      address,
      subtotal,
      total,
      discountPercentage,
      discountAmount,
      couponCode,
    } = payment.metadata || {};

    if (!Array.isArray(items) || !userId) {
      return res.sendStatus(200);
    }

    const previousPaidOrders = await Order.countDocuments({
      user: userId,
      status: "paid",
    });

    const loyaltyPointsEarned = PURCHASE_LOYALTY_POINTS;

    // ================= ORDER =================
    const newOrder = await Order.create({
      user: userId,

      items: items.map((i) => ({
        product: i.product,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        size: i.size || null,
        image: i.image || null,
      })),

      phone,
      address,

      subtotal: subtotal || 0,
      discountPercentage: discountPercentage || 0,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || null,
      loyaltyPointsEarned,

      total,
      paymentReference: reference,
      status: "paid",
    });

    // ================= COUPON =================
    if (couponCode && userId) {
      const coupon = await Coupon.findOne({ code: couponCode });

      if (coupon) {
        const existingUsage = coupon.usedBy?.find(
          (usage) => usage.userId?.toString() === userId.toString()
        );

        if (existingUsage) {
          await Coupon.findOneAndUpdate(
            { code: couponCode, "usedBy.userId": userId },
            {
              $inc: {
                usedCount: 1,
                "usedBy.$.count": 1,
              },
            }
          );
        } else {
          await Coupon.findOneAndUpdate(
            { code: couponCode },
            {
              $inc: { usedCount: 1 },
              $push: {
                usedBy: {
                  userId,
                  count: 1,
                },
              },
            }
          );
        }
      }
    }

    // ================= LOYALTY + REFERRAL =================
    const user = await User.findById(userId);

    if (user) {
      const pointsToAdd =
        loyaltyPointsEarned +
        (previousPaidOrders === 0 && user.referredBy && !user.referralRewardGranted
          ? REFERRED_CUSTOMER_BONUS_POINTS
          : 0);

      if (pointsToAdd > 0) {
        user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsToAdd;
        user.lifetimeLoyaltyPoints =
          (user.lifetimeLoyaltyPoints || 0) + pointsToAdd;
      }

      if (previousPaidOrders === 0 && user.referredBy && !user.referralRewardGranted) {
        await User.findByIdAndUpdate(user.referredBy, {
          $inc: {
            loyaltyPoints: REFERRER_BONUS_POINTS,
            lifetimeLoyaltyPoints: REFERRER_BONUS_POINTS,
            referralCount: 1,
          },
        });

        user.referralRewardGranted = true;
      }

      await user.save();
    }

    // ================= EMAIL =================
    setImmediate(async () => {
      try {
        const orderUser = await User.findById(userId);
        if (!orderUser) return;

        const emailResults = await Promise.allSettled([
          sendOrderEmailToUser(newOrder, orderUser),
          sendOrderEmailToAdmin(newOrder, orderUser),
        ]);

        emailResults.forEach((result, index) => {
          if (result.status === "rejected") {
            const target = index === 0 ? "user" : "admin";
            console.log(
              `ORDER EMAIL ERROR (${target}):`,
              result.reason?.message || result.reason
            );
          }
        });
      } catch (err) {
        console.log("EMAIL ERROR:", err.message);
      }
    });

    console.log("✅ ORDER CREATED:", reference);

    return res.sendStatus(200);
  } catch (error) {
    console.log("WEBHOOK ERROR:", error.message);
    return res.sendStatus(500);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ message: "No reference" });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    if (data.status !== "success") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    return res.json({
      message: "Payment verified",
      status: "success",
      reference: data.reference,
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err.message);
    res.status(500).json({ message: "Verify failed" });
  }
};

export const initializePayment = async (req, res) => {
  try {
    const { email, items, phone, address, couponCode } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!phone || !address)
      return res.status(400).json({ message: "Phone and address are required" });
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const productIds = items.map((i) => i.productId);

    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    const verifiedItems = items
      .map((item) => {
        const product = productMap.get(item.productId.toString());
        if (!product || !item.quantity) return null;

        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
          size: item.size || null,
          name: product.name,
          image: product.images?.[0] || product.image || null,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean);

    const subtotal = verifiedItems.reduce(
      (sum, i) => sum + i.lineTotal,
      0
    );

    // ================= COUPON =================
    let discountPercentage = 0;
    let appliedCoupon = null;

   if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
        $or: [
          { userId: null }, // global
          { userId: req.user._id }, // user-specific
        ],
      });

      if (!coupon) {
        return res.status(400).json({
          message: "Invalid or expired coupon",
        });
      }

      // 🔥 GLOBAL LIMIT CHECK
      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          message: "Coupon usage limit reached",
        });
      }

      // 🔥 PER USER LIMIT CHECK
      const userUsage = coupon.usedBy.find(
        (u) => u.userId?.toString() === req.user._id.toString()
      );

      if (userUsage && userUsage.count >= coupon.perUserLimit) {
        return res.status(400).json({
          message: "Coupon already used",
        });
      }

      discountPercentage = coupon.discountPercentage;
      appliedCoupon = coupon.code;
    }

    const discountAmount = (subtotal * discountPercentage) / 100;
    const total = subtotal - discountAmount;

    const amount = Math.round(total * 100);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        callback_url: `${process.env.CLIENT_URL}/payment-success`,
        metadata: {
          userId: req.user._id.toString(),
          items: verifiedItems,
          phone,
          address,

          subtotal,
          total,

          discountPercentage,
          discountAmount,
          couponCode: appliedCoupon,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.log("INIT PAYMENT ERROR:", error.message);
    return res.status(500).json({ message: "Payment initialization failed" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const user = req.user;

    const orders = await Order.find({ user: user._id })
      .populate("items.product")
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      _id: order._id,

      totalAmount: order.total,
      subtotal: order.subtotal,

      discountPercentage: order.discountPercentage,
      discountAmount: order.discountAmount,
      couponCode: order.couponCode,

      status: order.status,
      paymentReference: order.paymentReference,
      createdAt: order.createdAt,

      items: order.items.map((item) => ({
        _id: item._id,
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size || null,
      })),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.log("GET ORDERS ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
