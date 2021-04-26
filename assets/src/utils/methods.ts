import ImageKit from "imagekit";
import AWS from 'aws-sdk';
import {accessKeyId, AwsRegionCode} from "../config";

if (!process.env.IMAGE_KIT_PRIVATE_KEY) {
    throw new Error('IMAGE_KIT_PRIVATE_KEY must be defined');
}

export const imagekitConfig = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/kafwriey64l/',
    publicKey: 'public_k1JAmfGkYnDN/dhR+aVH6EpD9WM=',
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY || ''
});

export const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: '+9epyyvwqMzWOj3gzA5pO8RlGY3T3/a5tsr6fZqY',
    region: AwsRegionCode,
    signatureVersion: "v4"
});