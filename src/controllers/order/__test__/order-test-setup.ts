import request from "supertest";
import { app } from "../../../app";

import { PaymentMethods } from "../../../models/types/payment-method";
import { Cart } from "../../../models/cart";
import { Category } from "../../../models/category";
import { Address } from "../../../models/address";
import { User } from "../../../models/user";
import { Product } from "../../../models/product";

export const orderTestSetup = async () => {
    const category = Category.build({
      name: "Swiss watches",
      products: [],
    });
  
    const product = Product.build({
      name: "Omega Seamaster",
      price: 1000,
      image: ["omega.image.jpg"],
      description: "A great swiss watch",
      countInStock: 10,
      categories: [category],
    });
  
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
  
    await product.save();
    await user.save();
  
    const cart1 = Cart.build({});
    const cart2 = Cart.build({});
  
    await cart1.save();
    await cart2.save();
  
    await request(app)
      .put(`/api/cart/addtocart/${cart1.id}`)
      .send({
        productId: product.id,
        quantity: 5,
      })
      .expect(200);
  
    await request(app)
      .put(`/api/cart/addtocart/${cart2.id}`)
      .send({
        productId: product.id,
        quantity: 1,
      })
      .expect(200);
  
    const { body: orderOne } = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin(false, user.id))
      .send({
        cartId: cart1.id,
        address,
        paymentMethod: PaymentMethods.Paypal,
        shippingPrice: 400,
      })
      .expect(201);
  
    const { body: OrderTwo } = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin(false, user.id))
      .send({
        cartId: cart2.id,
        address,
        paymentMethod: PaymentMethods.Paypal,
        shippingPrice: 200,
      })
      .expect(201);
  
    return { user, orderOne, OrderTwo, product };
  };