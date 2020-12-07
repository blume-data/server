import {Router, Response, Request} from 'express';
import AWS from 'aws-sdk';
import {accessKeyId, secretAccessKey, AwsBucketName, AwsRegionCode, AwsImageRootUrl} from '../config';
import {okayStatus, RANDOM_STRING} from "@ranjodhbirkaur/common";
import {FileModel} from "../models/file-models";

const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region: AwsRegionCode,
    endpoint: `s3-${AwsRegionCode}.amazonaws.com`,
    signatureVersion: 'v4',
})

const router = Router();


router.post('/assets/get-signed-url', async (req: Request, res: Response) => {

    const {ContentType = 'image', name} = req.body;
    const imageName = `${RANDOM_STRING()}-${name}`;

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

    console.log('working');
});

router.put('/assets/upload-image', async (req: Request, res: Response) => {

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
});

export {router as uploadRoutes};