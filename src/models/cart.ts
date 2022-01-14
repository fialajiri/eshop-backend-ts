import { Product, ProductDoc } from "./product";
import { UserDoc } from "./user";
import mongoose, { mongo } from "mongoose";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { NotFoundError } from "../errors/not-found-error";

interface CartAttrs {}

interface CartModel extends mongoose.Model<CartDoc> {
  build(attrs: CartAttrs): CartDoc;
}

export interface CartDoc extends mongoose.Document {
  user: UserDoc | null;
  items: [
    {
      product: ProductDoc;
      quantity: number;
      price: number;
      subTotal: number;
    }
  ];
  total: number;
  updatedAt: Date;
  createdAt: Date;
  addToCart(product: ProductDoc, quantity: number): Promise<CartDoc>;
  subtractFromCart(
    product: ProductDoc,
    removedQuantity: number
  ): Promise<CartDoc>;
  removeFromCart(productId: string): Promise<CartDoc>;
  clearCart():Promise<CartDoc>
}

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        subTotal: { type: Number, default: 0, required: true },
      },
    ],
    total: { type: Number, default: 0, required: true },
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

cartSchema.statics.build = (attrs: CartAttrs) => {
  return new Cart(attrs);
};

cartSchema.methods.addToCart = async function name(
  product: ProductDoc,
  quantity: number
) {
  const cartProductIndex = this.items.findIndex((cp: any) => {
    return cp.product._id.toString() === product.id.toString();
  });

  let newQuantity: number;
  const updatedCartItems = [...this.items];

  if (
    quantity < 0 &&
    cartProductIndex >= 0 &&
    this.items[cartProductIndex].quantity <= Math.abs(quantity)
  ) {
    return await this.removeFromCart(product.id);
  } else if (cartProductIndex >= 0) {
    newQuantity = this.items[cartProductIndex].quantity + quantity;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedCartItems[cartProductIndex].subTotal =
      updatedCartItems[cartProductIndex].quantity * product.price;
    updatedCartItems[cartProductIndex].price = product.price;
  } else {
    updatedCartItems.push({
      product: product.id,
      quantity: quantity,
      price: product.price,
      subTotal: product.price * quantity,
    });
  }
  this.items = updatedCartItems;
  this.total = this.items
    .map((item: any) => item.subTotal)
    .reduce((acc: number, next: number) => acc + next);

  await this.save();
};

cartSchema.methods.subtractFromCart = async function (
  product: ProductDoc,
  removedQuantity: number
) {
  await this.addToCart(product, -removedQuantity);
 
};

cartSchema.methods.removeFromCart = async function (productId: string) {
  const updatedCartItems = this.items.filter((item: any) => {
    return item.product._id.toString() !== productId.toString();
  });

  this.items = updatedCartItems;

  if (this.items.length === 0) {
    this.total = 0;
  } else {
    this.total = this.items
      .map((item: any) => item.subTotal)
      .reduce((acc: number, next: number) => acc + next);
  }
  await this.save();
};

cartSchema.methods.clearCart = async function () {
  this.items = [];
  this.total = 0;
  await this.save();
};


const Cart = mongoose.model<CartDoc, CartModel>("Cart", cartSchema);

export { Cart };
















// cartSchema.methods.addToCart = async function name(
//   product: ProductDoc,
//   quantity: number
// ) {
//   const cartProductIndex = this.items.findIndex((cp: any) => {
//     return cp.product._id.toString() === product.id.toString();
//   });

//   let newQuantity: number;
//   const updatedCartItems = [...this.items];

//   if (cartProductIndex >= 0) {
//     newQuantity = this.items[cartProductIndex].quantity + quantity;
//     updatedCartItems[cartProductIndex].quantity = newQuantity;
//     updatedCartItems[cartProductIndex].subTotal =
//       updatedCartItems[cartProductIndex].quantity * product.price;
//     updatedCartItems[cartProductIndex].price = product.price;
//   } else {
//     updatedCartItems.push({
//       product: product.id,
//       quantity: quantity,
//       price: product.price,
//       subTotal: product.price * quantity,
//     });
//   }
//   this.items = updatedCartItems;
//   this.total = this.items
//     .map((item: any) => item.subTotal)
//     .reduce((acc: number, next: number) => acc + next);

//   await this.save();
// };


// cartSchema.methods.subtractFromCart = async function (
//   product: ProductDoc,
//   removedQuantity: number
// ) {

  // const cartProductIndex = this.items.findIndex((cp: any) => {
  //   return cp.product._id.toString() === product.id.toString();
  // });
  // let newQuantity: number;
  // const updatedCartItems = [...this.items];

  // if (
  //   cartProductIndex >= 0 &&
  //   this.items[cartProductIndex].quantity <= removedQuantity
  // ) {
  //   const updatedCart = await this.removeFromCart(product.id);
  //   return updatedCart;
  // } else if (cartProductIndex >= 0) {
  //   newQuantity = this.items[cartProductIndex].quantity - removedQuantity;
  //   updatedCartItems[cartProductIndex].quantity = newQuantity;
  //   updatedCartItems[cartProductIndex].subTotal =
  //     updatedCartItems[cartProductIndex].quantity * product.price;
  //   updatedCartItems[cartProductIndex].price = product.price;
  // }
  // this.items = updatedCartItems;
  // this.total = this.items
  //   .map((item: any) => item.subTotal)
  //   .reduce((acc: number, next: number) => acc + next);

  // await this.save();

