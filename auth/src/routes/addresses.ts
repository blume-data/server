import express from "express";
import {addressUrlsUrl} from "../util/urls";
import {getAddressUrl} from "../Controllers/AddressUrlsContoller";

const router = express.Router();

router.get(addressUrlsUrl, getAddressUrl);

export {router as addressRoutes};