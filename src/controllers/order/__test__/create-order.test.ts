import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";
import { Category } from "../../../models/category";
import { Product } from "../../../models/product";
import { Cart } from "../../../models/cart";
import { Address } from "../../../models/address";
import { PaymentMethods } from "../../../models/types/payment-method";
import { User } from "../../../models/user";

const setup = async () => {
  const category = Category.build({
    name: "Swiss watches",
    products: [],
  });

  await category.save();

  const product1 = Product.build({
    name: "Omega Seamaster",
    price: 1000,
    image: ["omega.image.jpg"],
    description: "A great swiss watch",
    countInStock: 10,
    categories: [category],
  });

  await product1.save();

  const product2 = Product.build({
    name: "Omega de Ville",
    price: 2999,
    image: ["omega.image.jpg"],
    description: "A great swiss watch",
    countInStock: 10,
    categories: [category],
  });
  await product2.save();

  const cart = Cart.build({});

  await cart.save();

  await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product1.id,
      quantity: 5,
    })
    .expect(200);

  await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product2.id,
      quantity: 2,
    })
    .expect(200);

  const address = Address.build({
    firstName: "Jiri",
    lastName: "Fiala",
    phone: "602107243",
    street: "Karoliny Svetle",
    streetNumber: "1794/1",
    city: "Teplice",
    postal: "41501",
  });

  const user = User.build({
    email: "test@test.com",
    password: "123456",
    isAdmin: true,
  });

  await user.save();

  return { cart, address, user, product1, product2 };
};

it("return a 401 if the user is not authenticated", async () => {
  await request(app).post("/api/orders").send().expect(401);
});

it("return a 404 if the cartId is invalid", async () => {
  const nonExistentCartId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(false))
    .send({
      cartId: nonExistentCartId,
    })
    .expect(404);
});

it("thorw an error if the users tries to order bigger than available quantity", async () => {
  const { cart, address, user, product1 } = await setup();

  const category = Category.build({
    name: "Swiss watches",
    products: [],
  });

  await category.save();

  const product = Product.build({
    name: "Omega Constalation",
    price: 10000,
    image: ["omega.image.jpg"],
    description: "A great swiss watch",
    countInStock: 10,
    categories: [category],
  });
  product.set({ availability: 6 });
  await product.save();

  const { body: updatedCart } = await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product.id,
      quantity: 8,
    })
    .expect(200);

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(false, user.id))
    .send({
      cartId: cart.id,
      address,
      paymentMethod: PaymentMethods.Paypal,
      shippingPrice: 200,
    })
    .expect(400);

  const product1Updated = await Product.findById(product1.id);

  expect(product1Updated?.availability).toEqual(10);
});

it("creates an order from valid cart", async () => {
  const { cart, address, user } = await setup();

  const {
    body: { order },
  } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(false, user.id))
    .send({
      cartId: cart.id,
      address,
      paymentMethod: PaymentMethods.Paypal,
      shippingPrice: 200,
    })
    .expect(201);
});

it("creates an order from valid cart and set reduces products availability by the ordered quantity", async () => {
  const { cart, address, user, product1, product2 } = await setup();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(false, user.id))
    .send({
      cartId: cart.id,
      address,
      paymentMethod: PaymentMethods.Paypal,
      shippingPrice: 200,
    })
    .expect(201);

  const product1Updated = await Product.findById(product1.id);
  const product2Updated = await Product.findById(product2.id);

  expect(product1Updated?.availability).toEqual(5);
  expect(product2Updated?.availability).toEqual(8);
});
