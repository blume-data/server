import {Response, Request} from 'express';
import {
    errorStatus, okayStatus, sendSingleError,
    getPageAndPerPage, paginateData
} from "@ranjodhbirkaur/common";
import {FileModel} from "../models/file-models";
import {imagekitConfig} from "../utils/methods";
import {
    AssetsGetAssetsUrl,
    AssetsAuthImageKit,
    AssetsVerifyUrl,
    AssetsCreateTempRecord,
    AssetsVerifyTempRecord, AssetsFetchAssetUrl
} from "../utils/urls";
import {DateTime} from "luxon";
import {ENTRY_CREATED_BY, FIRST_NAME, LAST_NAME} from "@ranjodhbirkaur/constants";

// fetch assets
export async function fetchAsset(req: Request, res: Response) {

    const {fileName} = req.query;
    if(fileName) {

        const exist = await FileModel.findOne({
            fileName: `${fileName}`
        }, ['_id', 'type']);

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

export async function getAssetsRoutes(req: Request, res: Response) {
    // fetch routes of other services
    res.status(okayStatus).send({
        // get single image
        getAsset: AssetsFetchAssetUrl,
        // get all assets
        getAssets: AssetsGetAssetsUrl,
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
        .populate(ENTRY_CREATED_BY, [FIRST_NAME, LAST_NAME])
        .skip(Number(page) * Number(perPage)).limit(Number(perPage));

    const data = await paginateData({Model: FileModel, items: assets, where, req});

    res.status(okayStatus).send(data);
}