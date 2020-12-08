import {Router} from 'express';
import {AssetsFetchAssetUrl, AssetsGetAssetsUrl, AssetsGetSignedUrl, AssetsRoutesUrl} from "../utils/urls";
import {getAssets, getSignedUrl, getAssetsRoutes, fetchAsset} from "../Controllers/assets";
import {checkAuth} from "../middleware/checkAuth";

const router = Router();

router.get(AssetsRoutesUrl, getAssetsRoutes);

router.get(AssetsFetchAssetUrl, fetchAsset);

router.get(AssetsGetAssetsUrl, checkAuth, getAssets);

router.post(AssetsGetSignedUrl, checkAuth, getSignedUrl);

/*router.put('/assets/upload-image', async (req: Request, res: Response) => {

    const body = req.files;
    console.log('body', body);

    s3.getSignedUrl('putObject', {
        Bucket: 'ranjod-assets',
        ContentType: 'image',
        Key: `any_name`,
    }, async (err, url) => {
        console.log('url', url);

        //const response = await axios.put(url);


    });



    res.status(okayStatus).send({
        link: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'
    });
});*/

export {router as assetsRoutes};