import {Router, Response, Request} from 'express';
import {
    AssetsAuthImageKit, AssetsCreateTempRecord,
    AssetsFetchAssetUrl, AssetsGetAssetsDataUrl,
    AssetsGetAssetsUrl,
    AssetsRoutesUrl, AssetsVerifyTempRecord
} from "../utils/urls";
import {
    getAssets,
    getAssetsRoutes,
    fetchAsset,
    createTempAssetsRecord,
    verifyTempAssetsRecord, updateAsset, fetchAssetData
} from "../Controllers/assets";
import {checkAuth} from "../middleware/checkAuth";
import {imagekitConfig} from "../utils/methods";
import {body} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";

const router = Router();

// asset routes
router.get(AssetsRoutesUrl, getAssetsRoutes);

// fetch images
router.get(AssetsFetchAssetUrl, fetchAsset);

// fetch asset data
router.get(AssetsGetAssetsDataUrl, fetchAssetData);

// update file asset
router.put(AssetsGetAssetsDataUrl, updateAsset);

// create temp image record
router.post(AssetsCreateTempRecord,
    [
        body('fileName')
            .notEmpty()
            .withMessage('fileName is required')
    ],
    validateRequest, checkAuth,
    createTempAssetsRecord);

router.post(AssetsVerifyTempRecord,
    [
        body('di_98')
            .notEmpty()
            .withMessage('di-98 is required'),
        body('emanelif_89')
            .notEmpty()
            .withMessage('emanelif-89 is required'),
        body('htap_21')
            .notEmpty()
            .withMessage('htap-21 is required')
    ], validateRequest,verifyTempAssetsRecord)

// get a list of images stored
router.get(AssetsGetAssetsUrl, checkAuth, getAssets);

// image-kit-authentication
router.get(AssetsAuthImageKit, (req: Request, res: Response) => {
    const result = imagekitConfig.getAuthenticationParameters();
    res.send(result);
})

export {router as assetsRoutes};