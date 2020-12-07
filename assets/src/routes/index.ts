import {Router} from 'express';
import {AssetsFetchAssetUrl, AssetsGetAssetsUrl, AssetsGetSignedUrl, AssetsRoutesUrl} from "../utils/urls";
import {getAssets, getSignedUrl, getAssetsRoutes, fetchAsset} from "../Controllers/assets";

const router = Router();

router.get(AssetsFetchAssetUrl, fetchAsset);

router.get(AssetsRoutesUrl, getAssetsRoutes);

router.get(AssetsGetAssetsUrl, getAssets);

router.post(AssetsGetSignedUrl, getSignedUrl);

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