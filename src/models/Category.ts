import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    image?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        image: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
