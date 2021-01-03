import {Router} from 'express';
import {
    AssetsFetchAssetUrl,
    AssetsGetAssetsUrl,
    AssetsGetSignedUrl,
    AssetsRoutesUrl,
    AssetsVerifyUrl
} from "../utils/urls";
import {getAssets, getSignedUrl, getAssetsRoutes, fetchAsset, verifyAssets} from "../Controllers/assets";
import {checkAuth} from "../middleware/checkAuth";

const router = Router();

router.get(AssetsRoutesUrl, getAssetsRoutes);

router.get(AssetsFetchAssetUrl, fetchAsset);

router.get(AssetsGetAssetsUrl, checkAuth, getAssets);

router.post(AssetsGetSignedUrl, checkAuth, getSignedUrl);

router.get(AssetsVerifyUrl, checkAuth, verifyAssets);

export {router as assetsRoutes};