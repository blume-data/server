import {Router, Response, Request} from "express";
import {EVENTS_ROUTE, EVENT_AUTH_NEW_JWT, okayStatus} from "@ranjodhbirkaur/common";
import { dataRouteUrls, RoleUrl, CollectionUrl, StoreUrl, ApplicationNameUrl } from "../util/urls";

const router = Router();

router.get(`${dataRouteUrls}`, (req: Request, res: Response) => {
    return res.status(okayStatus).send({
        RoleUrl,
        ApplicationNameUrl,
        CollectionUrl,
        StoreUrl
    });
});

export { router as DataRoutes };