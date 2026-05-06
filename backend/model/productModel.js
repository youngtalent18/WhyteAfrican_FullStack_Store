import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    }, 
    isFeatured: {
        type: Boolean,
        default: false
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    sizes: {
        type: [String],
        default: [],
    }
},
{
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;