import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILog extends Document {
    userId?: mongoose.Types.ObjectId;
    action: string;
    details?: Record<string, any>;
    ip?: string;
    createdAt: Date;
}

const LogSchema: Schema<ILog> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        action: {
            type: String,
            required: true,
        },
        details: {
            type: Schema.Types.Mixed,
        },
        ip: {
            type: String,
        },
    },
    { timestamps: true } // Creates createdAt
);

const Log: Model<ILog> =
    mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default Log;
