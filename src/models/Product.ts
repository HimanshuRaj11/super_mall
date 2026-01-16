import mongoose, { Schema, Document, Model } from 'mongoose';
import '@/models/Shop';

export interface IProduct extends Document {
    shopId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: string[];
    category?: string; // Optional sub-category within shop
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
    {
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        discountPrice: {
            type: Number,
            min: 0,
        },
        images: {
            type: [String],
            default: [],
        },
        category: {
            type: String,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
