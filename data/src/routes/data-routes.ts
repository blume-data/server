import {Router, Response, Request} from "express";
import {okayStatus} from "@ranjodhbirkaur/common";
import { dataRouteUrls, RoleUrl, CollectionUrl, StoreUrl, ApplicationNameUrl, GetCollectionNamesUrl } from "../util/urls";

const router = Router();

router.get(`${dataRouteUrls}`, (req: Request, res: Response) => {
    return res.status(okayStatus).send({
        RoleUrl,
        ApplicationNameUrl,
        CollectionUrl,
        StoreUrl,
        GetCollectionNamesUrl
    });
});

export { router as DataRoutes };