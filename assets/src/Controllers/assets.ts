import {Response, Request} from 'express';
import {
    errorStatus, okayStatus, sendSingleError,
    getPageAndPerPage, paginateData, RANDOM_STRING
} from "@ranjodhbirkaur/common";
import {FileModel} from "../models/file-models";
import {imagekitConfig, s3} from "../utils/methods";
import {
    AssetsGetAssetsUrl,
    AssetsAuthImageKit,
    AssetsVerifyUrl,
    AssetsCreateTempRecord,
    AssetsVerifyTempRecord, AssetsFetchAssetUrl, AssetsGetAssetsDataUrl
} from "../utils/urls";
import {DateTime} from "luxon";
import {ENTRY_CREATED_BY, ENTRY_UPDATED_AT, FIRST_NAME, LAST_NAME} from "@ranjodhbirkaur/constants";
import {AwsBucketName, AwsImageRootUrl} from "../config";

// fetch asset url
// on fetch redirect to the asset url
export async function fetchAsset(req: Request, res: Response) {

    const {fileName} = req.query;
    if(fileName) {

        const exist = await FileModel.findOne({
            fileName: `${fileName}`
        }, ['type']);

        if(exist) {

            let urlOptions: any = {
                path : `${fileName}`,
                signed : true,
                expireSeconds : 300
            };
            if(exist.type === 'image') {
                urlOptions.transformation = [{
                    original: "true",
                    progressive: 'true'
                }];
                urlOptions.queryParameters = {
                    "v" : "123"
                };
            }
            const imageURL = imagekitConfig.url(urlOptions);
            res.redirect(imageURL);
        }
        else {
            res.status(errorStatus).send('not found')
        }

    }
    else {
        sendSingleError(res, 'name is required');
    }

}

// fetch asset data
export async function fetchAssetData(req: Request, res: Response) {
    const {fileName} = req.query;
    

}

// update asset
export async function updateAsset(req: Request, res: Response) {

    const {id, newFileName, description=''} = req.query;
    if(id) {
        const exist = await FileModel.findOne({
            _id: `${id}`
        }, ['_id']);
        if(exist) {
            const notExist = await FileModel.findOne({
                fileName: `${newFileName}`
            }, ['_id']);

            if(!notExist) {
                await FileModel.findOneAndUpdate({
                    _id: id
                }, {
                    fileName: `${newFileName}`,
                    description: `${description}`
                });
            }
            else {
                return sendSingleError(res, `file with fileName ${newFileName} already exist`);
            }
        }
        else {
            sendSingleError(res, `File of id ${id} does not exist`);
        }

    }
    else {
        sendSingleError(res, `id is required`);
    }
}

export async function getAssetsRoutes(req: Request, res: Response) {
    // fetch routes of other services
    res.status(okayStatus).send({
        // get single image
        getAsset: AssetsFetchAssetUrl,
        // get all assets
        getAssets: AssetsGetAssetsUrl,
        // fetch asset Data
        AssetsGetAssetsDataUrl: AssetsGetAssetsDataUrl,
        verifyAssets: AssetsVerifyUrl,
        authAssets: AssetsAuthImageKit,
        t_s_4_6_3_t: AssetsCreateTempRecord,
        v_3_5_6: AssetsVerifyTempRecord
    });
}

export async function createTempAssetsRecord(req: Request, res: Response) {

    const {fileName} = req.body;
    const clientUserName  = req.params && req.params.clientUserName;
    const createdAt = DateTime.local().setZone('UTC').toJSDate();

    const tempRecord = FileModel.build({
        fileName,
        clientUserName,
        isVerified: false,
        createdBy: `${req.currentUser['id']}`,
        createdAt
    });
    await tempRecord.save();
    res.send(tempRecord.id);
}

export async function verifyTempAssetsRecord(req: Request, res: Response) {

    const {di_98/*id*/, emanelif_89/*fileName*/, htap_21/*path*/, tu/*thumbnail-url*/, h, w, s, ty/*type*/, dilife/*fileid*/} = req.body;
    const exist = await FileModel.find({
        _id: di_98
    });
    if(exist) {
        const fileType = emanelif_89.split('.').pop();
        await FileModel.findOneAndUpdate({
            _id: di_98
        }, {
            fileName: emanelif_89,
            path: htap_21,
            isVerified: true,
            thumbnailUrl: tu,
            height: Number(h) || 0,
            width: Number(w) || 0,
            size: Number(s),
            type: fileType,
            fileId: dilife
        });
        res.status(okayStatus).send(true);
    }
}

// get list of all assets
export async function getAssets(req: Request, res: Response) {
    const {page, perPage} = getPageAndPerPage(req);

    const where = {
        isVerified: true
    }
    const assets = await FileModel.find(where)
        .sort(`-${ENTRY_UPDATED_AT}`)
        .populate(ENTRY_CREATED_BY, [FIRST_NAME, LAST_NAME])
        .skip(Number(page) * Number(perPage)).limit(Number(perPage));

    const data = await paginateData({Model: FileModel, items: assets, where, req});

    res.status(okayStatus).send(data);
}







// aws
export async function fetchOneAsset(req: Request, res: Response) {

    const {name = 'some-name'} = req.query;
    if(name) {
        const fileName = `${name}`;
        const asset: any = await FileModel.findOne({
            name: fileName
        }, ['name']);
        if(asset && asset.name) {
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

export async function getSignedUrl(req: Request, res: Response) {
    const {ContentType = 'image', name} = req.body;
    const imageName = `${RANDOM_STRING(10)}-${name}`;

    s3.getSignedUrl('putObject', {
        Bucket: AwsBucketName,
        ContentType,
        Key: imageName,
    }, async (err, url) => {
        const imageUrl = `${AwsImageRootUrl}${imageName}`;
        const newFile = FileModel.build({
            path: imageUrl,
            clientUserName: '',
            fileId: "",
            isVerified: false,
            createdAt: new Date(),
            thumbnailUrl: "",
            size: 0,
            type: '',
            createdBy: '',
            width: 0,
            fileName: imageName
        });
        await newFile.save();
        res.send({
            url
        });
    });
}