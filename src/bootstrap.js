import express from "express";
import morgan from "morgan";
import { AppError, catchAsyncError } from "./utils/error.handler.js";
import v1Router from "./routers/v1.routes.js";
import stripe from "stripe";
import cors from "cors";
import { makeOnlinePayment } from "./modules/cart/controllers/order.controller.js";
const bootstrap = (app) => {
  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    catchAsyncError(async (request, response) => {
      const sig = request.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed":
          const data = event.data.object;
          await makeOnlinePayment(data);
          console.log({ data });
          // Then define and call a function to handle the event checkout.session.completed
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send();
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(
    cors({
      origin: "*", // replace 3000 with the port you are using
    })
  );
  app.use(morgan("dev"));

  app.use("/api/v1", v1Router);

  app.all("*", (req, res, next) => {
    throw new AppError("Route not found", 404);
  });

  app.use((err, req, res, next) => {
    const { message, status, stack } = err;
    res.status(status || 500).json({
      message,
      ...(process.env.MODE === "development" && { stack }),
    });
  });
};
//mostafaa
export default bootstrap;
