import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFloor extends Document {
    name: string; // e.g. "Ground Floor", "1st Floor"
    level: number; // e.g. 0, 1, 2
    mapImage?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const FloorSchema: Schema<IFloor> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        level: {
            type: Number,
            required: true,
            unique: true,
        },
        mapImage: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

const Floor: Model<IFloor> =
    mongoose.models.Floor || mongoose.model<IFloor>('Floor', FloorSchema);

export default Floor;
