import mongoose, { Date } from "mongoose";
import { ProductDoc } from "./product";
import { PaymentMethods } from "./types/payment-method";
import { AddressDoc, addressSchema } from "./address";
import { OrderStatus } from "./types/order-status";

interface OrderAttrs {
  user: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

export interface OrderDoc extends mongoose.Document {
  user: string;
  orderItems: [
    {
      name: string;
      quantity: number;
      image: string;
      price: number;
      subtotal: number;
      product: ProductDoc;
    }
  ];
  shippingAddress: AddressDoc;
  paymentMethod: PaymentMethods;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  paidAt: Date;
  deliveredAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

const orderSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: addressSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(PaymentMethods),
    },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    orderStatus: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
