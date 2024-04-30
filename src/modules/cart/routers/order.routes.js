import { Router } from "express";
import { authenticate, authorize } from "../../auth/auth.middlewares.js";
import { ROLES } from "../../../utils/enums.js";

import { assertCart } from "../middlewares/cart.middleware.js";
import {
  getUsersOrders,
  makeCODOrder,
  makePaymentSession,
} from "../controllers/order.controller.js";
import { validate } from "../../../middlewares/validation.middleware.js";
import { addOrderSchema } from "../validations/order.validations.js";

const router = Router();

router.route("/").get(authenticate, authorize(ROLES.USER), getUsersOrders);
router
  .route("/cash")
  .post(
    authenticate,
    authorize(ROLES.USER),
    validate(addOrderSchema),
    assertCart,
    makeCODOrder
  );
router
	.route('/card')
	.post(authenticate, authorize(ROLES.USER), assertCart, makePaymentSession)

export default router;
