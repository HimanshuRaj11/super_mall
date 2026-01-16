import mongoose, { Schema, Document, Model } from 'mongoose';
import '@/models/User';
import '@/models/Floor';
import '@/models/Category';

export interface IShop extends Document {
    merchantId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    image?: string;
    floorId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    isActive: boolean; // For admin approval
    location?: string; // Specific section/unit number
    createdAt: Date;
    updatedAt: Date;
}

const ShopSchema: Schema<IShop> = new Schema(
    {
        merchantId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a shop name'],
            trim: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        floorId: {
            type: Schema.Types.ObjectId,
            ref: 'Floor',
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false, // Pending admin approval
        },
        location: {
            type: String,
        },
    },
    { timestamps: true }
);

const Shop: Model<IShop> =
    mongoose.models.Shop || mongoose.model<IShop>('Shop', ShopSchema);

export default Shop;
