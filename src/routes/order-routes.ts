import express from "express";
import { requireAuth } from "../middlewares/require-auth";
import { requireAdmin } from "../middlewares/require-admin";

import { createOrder } from "../controllers/order/create-order";
import { getAllOrders } from "../controllers/order/get-all-orders";
import { getUserOrders } from "../controllers/order/get-user-orders";
import { getOrderById } from "../controllers/order/get-order-by-id";
import { updateOrderToPaid } from "../controllers/order/update-order-to-paid";
import { updateOrderToDelivered } from "../controllers/order/update-order-to-delivered";

const router = express.Router();

router.post("/api/orders", requireAuth, createOrder);

router.get("/api/orders", requireAdmin, getAllOrders);

router.get("/api/orders/myorders", requireAuth, getUserOrders);

router.get("/api/orders/:orderId", requireAuth, getOrderById);

router.put("/api/orders/pay/:orderId", requireAdmin, updateOrderToPaid);

router.put(
  "/api/orders/delivered/:orderId",
  requireAdmin,
  updateOrderToDelivered
);

export { router as OrderRoutes };
