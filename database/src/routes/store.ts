import express, {Response, Request} from "express";
import {RanjodhbirModel} from "../ranjodhbirDb/model";
//import axios from 'axios';

const route = express.Router();

route.post('/store', async (req: Request, res: Response) => {
    const db = new RanjodhbirModel('store-data', [{name: 'age', type: "number"}]);
    await db.createSchema();

    for(let i = 1; i<25000; i++) {
        //await db.storeData({age: 3242432432434324});
    }
    const data = await db.readData();
    res.send(data);
});

/*route.post('/store/test', async (req: Request, res: Response) => {
    console.log('hello testing')
    const response = await axios.post('http://database-srv:3000/store');
    console.log(response.data);
    res.send(response.data);
});*/

export { route as StoreRoutes };