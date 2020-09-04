import express from "express";
import {getAddressUrls} from "../util/urls";
import {getAddressUrl} from "../Controllers/AddressUrlsContoller";
import {validateUserType} from "../middleware/userTypeCheck";

const router = express.Router();

router.get(getAddressUrls(), validateUserType, getAddressUrl);

export {router as addressRoutes};