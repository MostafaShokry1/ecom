import Stripe from "stripe";
import dotenv from "dotenv";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { AppError, catchAsyncError } from "../../../utils/error.handler.js";
import couponModel from "../../coupon/models/coupon.model.js";
import productModel from "../../product/models/product.model.js";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import userModel from "../../user/models/user.model.js";
import { createInvoice } from "../../../utils/pdf.js";
import { transporter } from "../../../utils/mailer.js";
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
  //make invoice

  const invoice = {
    shipping: {
      name: req.user.name,
      address: req.body.address,
    },
    items: cart.products.map(
      ({ product_id: { title, description, discounted_price }, quantity }) => ({
        quantity,
        item: title,
        description,
        amount: discounted_price * 100 * quantity,
      })
    ),
    subtotal: cart.total_price * 100,
    paid: 0,
    invoice_nr: order._id,
  };

  createInvoice(invoice, "invoice.pdf");
  await transporter.sendMail({
    to: req.user.email,
    attachments: [
      {
        path: "invoice.pdf",
        contentType: "application/pdf",
      },
    ],
  });
  console.log(req.user.email);
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
    mode: "payment",
    success_url: req.query.url,
    cancel_url: "https://chatgpt.com/",
    client_reference_id: cart.user_id,
    customer_email: req.user.email,
    metadata: {
      address: req.body.address,
      phone: req.body.phone,
      details: req.body.details,
    },
  });
  res.json({ session });
});
export const makeOnlinePayment = async (data) => {
  const { customer_email,metadata} = data;
  console.log(customer_email);
  console.log(metadata.address);
  console.log(metadata.phone);

  const user = await userModel.findOne({ email: customer_email});
  console.log({ user });
  const cart = await cartModel.findOne({ user_id: user._id });
  console.log({ cart });
  const order = await orderModel.create({
    user_id: user._id,
    address: metadata.address,
    phone_Number:metadata.phone,
    coupon: {
      discount: cart.coupon_id?.discount || 0,
    },
    is_paid: true,
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
    phone_Number: "",
    payment_type: "card",
  });
  console.log(order);
};
