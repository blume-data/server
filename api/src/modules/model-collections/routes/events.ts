import express, {Request, Response} from "express";
import {onEnvCreate} from "../Controllers/ApplicationNameController";
import {sendOkayResponse} from "../../../util/methods";
import {JWT_KEY, sendSingleError} from "../../../util/common-module";


const router = express.Router();

router.post('/data-events', async (req: Request, res: Response) => {
    const reqBody = req.body;
    console.log('got event', req.body)
    if(reqBody
        && reqBody.key
        && reqBody.key === JWT_KEY
        && reqBody.type) {
        switch (reqBody.type) {
            case 'OnEnvCreate': {
                const data: any = reqBody.data;
                await onEnvCreate(data);
                break;
            }
        }
        return sendOkayResponse(res, {});
    }
    return sendSingleError(res, 'welcome hacker bro :)');
});

export { router as EventRoutes };