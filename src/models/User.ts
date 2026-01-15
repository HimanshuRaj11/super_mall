import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'merchant' | 'user';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ['admin', 'merchant', 'user'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite on HMR
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
