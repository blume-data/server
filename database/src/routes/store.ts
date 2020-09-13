import express, {Response, Request} from "express";
import {RanjodhbirModel} from "../ranjodhbirDb/model";

const route = express.Router();

route.post('/store', async (req: Request, res: Response) => {
    const db = new RanjodhbirModel('store-data', [{name: 'age', type: "number"}]);
    await db.createSchema();

    await db.storeData({age: 54});
    const data = await db.readData();
    res.send(data);
});

export { route as StoreRoutes };