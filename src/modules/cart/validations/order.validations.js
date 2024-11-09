import Joi from "joi";
import { schemas } from "../../../utils/schema.js";

export const addOrderSchema = Joi.object({
  body: {
    address:Joi.string(),
    phone_Number: schemas.phone.required(),
  },
  params: {},
  query: {},
});

export const deleteOrderSchema = Joi.object({
  body: { order_id: schemas.modelId.required() },
  params: {},
  query: {},
});
