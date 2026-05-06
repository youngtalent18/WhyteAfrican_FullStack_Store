import mongoose,{Schema} from "mongoose";

const orderModel = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        image: String,
        name: String,
        size: String,
        quantity: Number,
        price: Number,
      },
    ],

    phone: {  
      type: String, 
      required: true 
    },
    address: { 
      type: String, 
      required: true 
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "paid"],
      default: "pending",
    },

    paymentReference: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderModel);

export default Order;