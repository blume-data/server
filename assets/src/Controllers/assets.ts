import {Response, Request} from 'express';
import {okayStatus, RANDOM_STRING, sendSingleError} from "@ranjodhbirkaur/common";
import {FileModel} from "../models/file-models";
import {s3} from "../utils/methods";
import {AwsBucketName, AwsImageRootUrl} from "../config";
import {AssetsGetAssetsUrl, AssetsGetSignedUrl} from "../utils/urls";

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

    const exist = await FileModel.find({
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
                name
            });
            await newFile.save();
            res.send({
                url,
                imageUrl
            });
        });

    }
}