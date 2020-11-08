import {Router, Response, Request} from "express";
import {EVENTS_ROUTE, EVENT_AUTH_NEW_JWT} from "@ranjodhbirkaur/common";

const router = Router();

router.get(`/${EVENTS_ROUTE}`, (req: Request, res: Response) => {
    const {type, payload} = req.body;

    switch (type) {
        case EVENT_AUTH_NEW_JWT: {
            break;
        }
    }
});

export { router as EventRoutes };