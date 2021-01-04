import AWS from "aws-sdk";
import {accessKeyId, AwsRegionCode} from "../config";

if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS_SECRET_ACCESS_KEY_2 must be defined');
}
export const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: AwsRegionCode,
    signatureVersion: 'v4',
});