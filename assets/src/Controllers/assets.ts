import {Response, Request} from 'express';
import {okayStatus, RANDOM_STRING, sendSingleError} from "@ranjodhbirkaur/common";
import httpProxy from 'http-proxy';
import {FileModel} from "../models/file-models";
import {s3} from "../utils/methods";
import {AwsBucketName, AwsImageRootUrl} from "../config";
import {AssetsGetAssetsUrl, AssetsGetSignedUrl} from "../utils/urls";

const proxy = httpProxy.createProxyServer({
    secure: false,
    changeOrigin: true,
    xfwd: true,
});

// on Error
proxy.on('error', function(e) {
    console.log('Error in proxy server', e);
});

export async function fetchAsset(req: Request, res: Response) {

    const {name = 'some-name'} = req.query;
    if(name) {
        console.log('body', name);
        const fileName = `${name}`;
        const asset = await FileModel.findOne({
            name: fileName
        }, ['name']);
        if(asset && asset.url) {
            const options = {
                Bucket: AwsBucketName,
                Key: fileName
            };
            res.attachment(fileName);
            s3.getObject(options).createReadStream().pipe(res);
        }
        else {
            sendSingleError(res, 'asset is not found', 'name');
        }
    }
    else {
        sendSingleError(res, 'name is required', 'name');
    }

}

export async function getAssetsRoutes(req: Request, res: Response) {
    res.status(okayStatus).send({
        getSignedUrl: AssetsGetSignedUrl,
        getAssets: AssetsGetAssetsUrl
    })
}

export async function getAssets(req: Request, res: Response) {

    const assets = await FileModel.find({});
    res.status(okayStatus).send(assets);
}

export async function getSignedUrl(req: Request, res: Response) {
    const {ContentType = 'image', name} = req.body;
    const imageName = `${RANDOM_STRING()}-${name}`;

    const exist = await FileModel.findOne({
        name
    }, ['name']);

    if(exist) {
        sendSingleError(res, 'Image with same name already exist');
    }
    else {
        s3.getSignedUrl('putObject', {
            Bucket: AwsBucketName,
            ContentType,
            Key: imageName,
        }, async (err, url) => {

            const imageUrl = `${AwsImageRootUrl}${imageName}`;
            const newFile = FileModel.build({
                url: imageUrl,
                name: imageName
            });
            await newFile.save();
            res.send({
                url,
                imageUrl
            });
        });

    }
}