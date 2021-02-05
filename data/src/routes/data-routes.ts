import {Router, Response, Request} from "express";
import {okayStatus} from "@ranjodhbirkaur/common";
import {
    dataRouteUrls,
    RoleUrl,
    CollectionUrl,
    StoreUrl,
    ApplicationNameUrl,
    GetCollectionNamesUrl, GetEntriesUrl
} from "../util/urls";

const router = Router();

router.get(`${dataRouteUrls}`, (req: Request, res: Response) => {
    return res.status(okayStatus).send({
        RoleUrl,
        ApplicationNameUrl,
        CollectionUrl,
        StoreUrl,
        GetCollectionNamesUrl,
        GetEntriesUrl
    });
});

export { router as DataRoutes };