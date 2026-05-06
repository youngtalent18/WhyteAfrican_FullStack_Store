import mongoose, { Schema } from "mongoose";

const couponModel = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // 🔥 null = global coupon
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🔥 WHO HAS USED IT
    usedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        count: {
          type: Number,
          default: 1,
        },
      },
    ],

    // 🔥 GLOBAL LIMIT
    usageLimit: {
      type: Number,
      default: 0, // 0 = unlimited
    },

    // 🔥 GLOBAL COUNT
    usedCount: {
      type: Number,
      default: 0,
    },

    // 🔥 PER USER LIMIT
    perUserLimit: {
      type: Number,
      default: 1, // default: once per user
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponModel);
export default Coupon;