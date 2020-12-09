import {Response, Request} from 'express';
import {CLIENT_USER_NAME, okayStatus, RANDOM_STRING, sendSingleError} from "@ranjodhbirkaur/common";
import {FileModel} from "../models/file-models";
import {s3} from "../utils/methods";
import {AwsBucketName, AwsImageRootUrl} from "../config";
import {AssetsGetAssetsUrl, AssetsGetSignedUrl} from "../utils/urls";

export async function fetchAsset(req: Request, res: Response) {

    const {name = 'some-name'} = req.query;
    if(name) {
        const fileName = `${name}`;
        const asset = await FileModel.findOne({
            fileName
        }, ['url']);
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
    });
}

export async function getAssets(req: Request, res: Response) {

    const assets = await FileModel.find({}).skip(0).limit(10);
    res.status(okayStatus).send(assets);
}

export async function getSignedUrl(req: Request, res: Response) {
    const {ContentType = 'image', name} = req.body;
    const clientUserName = req.params[CLIENT_USER_NAME];
    const fileName = `${RANDOM_STRING(10)}-${name}`;

    s3.getSignedUrl('putObject', {
        Bucket: AwsBucketName,
        ContentType,
        Key: fileName,
    }, async (err, url) => {
        const fileUrl = `${AwsImageRootUrl}${fileName}`;
        const newFile = FileModel.build({
            fileName: fileName,
            type: ContentType,
            clientUserName,
            isVerified: false,
            url: fileUrl
        });
        await newFile.save();
        res.send({
            url
        });
    });
}