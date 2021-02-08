// remove aws sdk

import ImageKit from "imagekit";

if (!process.env.IMAGE_KIT_PRIVATE_KEY) {
    throw new Error('IMAGE_KIT_PRIVATE_KEY must be defined');
}

export const imagekitConfig = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/kafwriey64l/',
    publicKey: 'public_k1JAmfGkYnDN/dhR+aVH6EpD9WM=',
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY || ''
});