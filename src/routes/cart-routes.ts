import express from "express";

import { getCart } from "../controllers/cart/get-cart";
import { getCartById } from "../controllers/cart/get-cart-by-id";
import { addToCart } from "../controllers/cart/add-to-cart";
import { subtractFromCart } from "../controllers/cart/subtract-from-cart";
import { removeProductFromCart } from "../controllers/cart/remove-product-from-cart";
import { clearCart } from "../controllers/cart/clear-cart";

const router = express.Router();

router.get("/api/cart", getCart);

router.get("/api/cart/:cartId", getCartById);

router.put("/api/cart/addtocart/:cartId", addToCart);

router.put("/api/cart/subtractfromcart/:cartId", subtractFromCart);

router.put("/api/cart/removefromcart/:cartId", removeProductFromCart);

router.put("/api/cart/clearcart/:cartId", clearCart);

export { router as cartRoutes };
