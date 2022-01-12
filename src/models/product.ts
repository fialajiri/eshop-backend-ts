import { CategoryDoc } from "./category";
import mongoose from "mongoose";

interface ProductAttrs {
  name: string;
  image: string[];
  categories: CategoryDoc[];
  description: string;
  price: number;
  countInStock: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

export interface ProductDoc extends mongoose.Document {
  name: string;
  image: string[];
  categories: CategoryDoc[];
  description: string;
  price: number;
  countInStock: number;
  availability: number;
  updatedAt: Date;
  createdAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: [{ type: String, required: true }],
    categories: [{ type: mongoose.Types.ObjectId, ref: "Category" }],
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    availability: {
      type: Number,
      default: function () {
        const _t = this as any;
        return _t.countInStock;
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
