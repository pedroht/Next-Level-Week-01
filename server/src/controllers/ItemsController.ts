import { Request, Response } from "express";
import knex from "../database/connection";

class ItemsController {
  async index(req: Request, res: Response) {
    try {
      const items = await knex("items").select("*");

      const serializedItems = items.map((item) => {
        return {
          id: item.id,
          title: item.title,
          image_url: `http://192.168.0.5:3333/uploads/${item.image}`,
        };
      });

      return res.json(serializedItems);
    } catch (error) {
      return res.json(error);
    }
  }
}

export default ItemsController;
