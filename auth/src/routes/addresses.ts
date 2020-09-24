import {Router} from "express";
import {getAddressUrls} from "../util/urls";
import {getAddressUrl} from "../Controllers/AddressUrlsContoller";

const router = Router();

router.get(getAddressUrls(), getAddressUrl);

export {router as addressRoutes};