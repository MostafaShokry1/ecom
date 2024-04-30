import Stripe from "stripe";
import dotenv from "dotenv";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { AppError, catchAsyncError } from "../../../utils/error.handler.js";
import couponModel from "../../coupon/models/coupon.model.js";
import productModel from "../../product/models/product.model.js";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const getUsersOrders = catchAsyncError(async (req, res) => {
  const apiFeatures = new ApiFeatures(
    orderModel.find({ user_id: req.user.id }),
    req.Query
  ).paginate(10);
  const orders = await apiFeatures.query;
  res.json({ orders });
});
export const makeCODOrder = catchAsyncError(async (req, res) => {
  const cart = await cartModel.findOne({ user_id: req.user.id });
  cart.products.forEach(({ product_id, quantity }) => {
    if (product_id.stock < quantity) throw new AppError("product is done");
  });
  const order = await orderModel.create({
    user_id: req.user.id,
    coupon: {
      discount: cart.coupon_id?.discount || 0,
    },
    products: cart.products.map(
      ({ product_id: { title, price, discounted_price }, quantity }) => ({
        quantity,
        product: {
          title,
          price,
          discounted_price,
        },
      })
    ),
    ...req.body,
  });
  if (!order) throw new AppError("Order failed", 400);
  const bulkWriteOptions = cart.products.map(
    ({ product_id: { _id }, quantity }) => ({
      updateOne: {
        filter: { _id },
        update: {
          $inc: {
            stock: -quantity,
          },
        },
      },
    })
  );
  await productModel.bulkWrite(bulkWriteOptions);
  res.json({ order });
});
export const makePaymentSession = catchAsyncError(async (req, res) => {
  const cart = await cartModel.findOne({ user_id: req.user.id });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "EGP",
          unit_amount: cart.total_price * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode:"payment",
    success_url:'',
    cancel_url:"",
    client_reference_id:cart._id,

  });
  res.json({session})
});