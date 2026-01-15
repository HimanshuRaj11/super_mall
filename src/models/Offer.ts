import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOffer extends Document {
    shopId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    discountPercentage?: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const OfferSchema: Schema<IOffer> = new Schema(
    {
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        discountPercentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Offer: Model<IOffer> =
    mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

export default Offer;
