import express, { response } from "express";
import { celebrate, Joi } from "celebrate";

import multer from "multer";
import path from "path";
import multerConfig from "./config/multer";

import ItemsController from "./controllers/ItemsController";
import PointsController from "./controllers/PointsController";

const routes = express.Router();
const upload = multer({
  ...multerConfig,
  fileFilter(req, file, callback) {
    const validExtensions = [".jpg", ".png", ".jpeg"];
    const extension = path.extname(file.originalname).toLowerCase();

    validExtensions.includes(extension)
      ? callback(null, true)
      : callback(new Error("Format not permited"));
  },
});

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);

routes.get("/points", pointsController.index);
routes.get("/points/:id", pointsController.show);

routes.post(
  "/points",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  pointsController.create
);

export default routes;
