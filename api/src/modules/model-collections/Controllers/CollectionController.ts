import {Request, Response} from 'express';
import {BadRequestError, okayStatus, sendSingleError} from "../../../util/common-module";
import {CUSTOME_COLLECTION_MODEL_FIELD_COUNT, MAX_COLLECTION_LIMIT,} from "../../../util/constants";
import {CollectionModel} from "../../../db-models/Collection";
import {CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT, COLLECTION_ALREADY_EXIST} from "../../../util/Messages";

import {
    BOOLEAN_FIElD_TYPE,
    DATE_AND_TIME_FIElD_TYPE,
    DATE_FIElD_TYPE,
    ENTRY_UPDATED_AT,
    ENTRY_UPDATED_BY,
    INTEGER_FIElD_TYPE,
    JSON_FIELD_TYPE,
    LOCATION_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE,
    MEDIA_FIELD_TYPE,
    REFERENCE_FIELD_TYPE,
    RuleType,
    SHORT_STRING_FIElD_TYPE,
    trimCharactersAndNumbers
} from "@ranjodhbirkaur/constants";
import {createModel, flatObject, sendOkayResponse} from "../../../util/methods";
import {DateTime} from "luxon";
import {v4} from 'uuid';
import { getCollection } from '../../entries/Controllers/StoreController';
import { CustomCollectionModel, REFERENCE_FIELD_NAME_CUSTOME_MODEL } from '../../../db-models/CustomCollections';

export async function createCollectionSchema(req: Request, res: Response) {

    const clientUserName  = req.params && req.params.clientUserName;
    const applicationName  = req.params && req.params.applicationName;
    const env = req.params && req.params.env;
    const reqMethod = req.method;

    const reqBody = req.body;
    const {setting=''} = reqBody;

    if(reqMethod === 'POST') {
        /*If in create mode*/
        /*Check collection limit*/
        const isInLimit = await CollectionModel.find({
            clientUserName
        },'name');
        
        const uid = v4();

        if ((isInLimit && isInLimit.length) > MAX_COLLECTION_LIMIT) {
            throw new BadRequestError(CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT);
        }

        // the name of the custom schema collection should not contain any space
        if (reqBody && reqBody.name && typeof reqBody.name === 'string') {
            reqBody.name = trimCharactersAndNumbers(reqBody.name);
        }

        // Check if there is not other collection with same name and user_id
        const alreadyExist = await CollectionModel.findOne({
            clientUserName, name: reqBody.name, env, applicationName
        }, 'id');

        if (alreadyExist) {
            throw new BadRequestError(COLLECTION_ALREADY_EXIST);
        }
        const createdAt = DateTime.local().setZone('UTC').toJSDate();

        const newCollection = CollectionModel.build({
            clientUserName,
            isPublic: false,
            applicationName,
            rules: JSON.stringify(reqBody.rules),
            name: reqBody.name,
            displayName: reqBody.displayName,
            env,
            id: uid,
            updatedById: `${req.currentUser.id}`,
            description: reqBody.description,
            createdAt,
            createdById: `${req.currentUser.id}`,
            updatedAt: createdAt,
            titleField: reqBody.titleField ? reqBody.titleField : reqBody.rules[0].name,
            settingId: setting
        });

        await newCollection.save();
        
        return sendOkayResponse(res);
    }
    else {

        const exist = await CollectionModel.findOne({
            id: reqBody.id
        },
            ['name', 'rules']);

        if(exist) {
            const update: any = {};
            if(reqBody.rules) {
 
                let countMap;
                //let oldRules;
                const collection = await getCollection(req, reqBody.name);
                    if(collection) {
                        let oldRules = JSON.parse(collection.rules);
                        let countMap : any = {
                            [SHORT_STRING_FIElD_TYPE]: [],
                            [INTEGER_FIElD_TYPE]: [],
                            [LONG_STRING_FIELD_TYPE]: [],
                            [BOOLEAN_FIElD_TYPE]: [],
                            [LOCATION_FIELD_TYPE]: [],
                            [JSON_FIELD_TYPE]: [],
                            [MEDIA_FIELD_TYPE]: [],
                            [REFERENCE_FIELD_NAME_CUSTOME_MODEL]: [],
                            [DATE_FIElD_TYPE]: [],
                            [DATE_AND_TIME_FIElD_TYPE]: []
                        };

                        // create count map
                        oldRules.map((r: RuleType) => {
                            if(r.type === REFERENCE_FIELD_TYPE) {
                                countMap[REFERENCE_FIELD_NAME_CUSTOME_MODEL].push(r.indexNumber);
                            }
                            else {
                                countMap[r.type].push(r.indexNumber);
                            }
                        });

                        reqBody.rules.map((r: RuleType, index: number) => {
                            const exist = oldRules.find((rule: RuleType) => rule.name === r.name);
                            // its a new field added
                            if(!exist) {
                                for(let i=0; i<= CUSTOME_COLLECTION_MODEL_FIELD_COUNT; i++) {
                                    const fieldName = (r.type === REFERENCE_FIELD_TYPE ? REFERENCE_FIELD_NAME_CUSTOME_MODEL : r.type);
                                    if(!countMap[fieldName].includes(i)) {
                                        reqBody.rules[index].indexNumber=i;
                                        countMap[fieldName].push(i);
                                    }
                                }
                            }
                            else {
                                reqBody.rules[index].indexNumber = exist.indexNumber;
                            }
                        })

                        // clear the values which are deleted
                        oldRules.map(async (r: RuleType) => {
                            const exist = reqBody.rules.find((rule: RuleType) => rule.name === r.name);
                            // a field is deleted
                            if(!exist) {
                                await CustomCollectionModel.updateMany({
                                    clientUserName,
                                    applicationName,
                                    name: collection.name,
                                    env
                                }, {
                                    [`${r.type}${r.indexNumber}`]: undefined
                                });

                            }
                        });

                    }
                


                update.rules = JSON.stringify(reqBody.rules);
            }
            if(reqBody.description) {
                update.description = reqBody.description;
            }
            if(reqBody.displayName) {
                update.displayName = reqBody.displayName;
            }

            if(reqBody.titleField) {
                update.titleField = reqBody.titleField;
            }

            update[ENTRY_UPDATED_AT] = DateTime.local().setZone('UTC').toJSDate();
            update[`${ENTRY_UPDATED_BY}Id`] = req.currentUser.id;

            await CollectionModel.findOneAndUpdate({
                id: reqBody.id
            }, update);
        
            res.status(okayStatus).send('done');

        }
        else {
            return sendSingleError(res, 'Model not found');
        }
    }

}

/*Return the list of collections in an application name*/
export async function getCollectionNames(req: Request, res: Response) {

    const clientUserName  = req.params && req.params.clientUserName;
    const applicationName  = req.params && req.params.applicationName;
    const language = req.params && req.params.language;
    const env = req.params && req.params.env;
    const name = req.query.name;
    const getOnly = `${req.query.get}`;
    const where: any = {
        clientUserName,
        applicationName,
        language,
        env
    };
    let get: string[] = ['rules', 'name', 'description', 'displayName', 'updatedAt', 'updatedById', 'titleField', 'id'];
    
    if(req.query.get && getOnly) {
        get = getOnly.split(',');
        get.push('id');
    }
    if(name) {
        where.name = name;
        get.push('settingId');
    }

    const query = CollectionModel.find(where, get);

    if(get.includes(`${ENTRY_UPDATED_BY}Id`)) {
        query.populate(ENTRY_UPDATED_BY, 'firstName lastName');
    }

    if(get.includes('settingId')) {
        query.populate({
            path: 'setting',
            populate: [
                {path: 'permittedUserGroups', select: 'name' }, 
                {path: 'restrictedUserGroups', select: 'name description'}
            ]
        });
    }

    const collections = await query;
    const flatty = flatObject(collections, {settingId: undefined, [`${ENTRY_UPDATED_BY}Id`]: undefined}, [
        {name : 'setting', items: ['permittedUserGroups', 'restrictedUserGroups','supportedDomains', 'isPublic']},
    ]);
    res.status(okayStatus).send(flatty);
}

export async function deleteCollectionSchema(req: Request, res: Response) {
    const clientUserName  = req.params && req.params.clientUserName;
    const applicationName  = req.params && req.params.applicationName;
    const env = req.params && req.params.env;

    const reqBody = req.body;

    const itemSchema = await CollectionModel.findOne({
        clientUserName,
        name: reqBody.name,
        applicationName,
        env
    }, ['rules', 'name']);

    if (itemSchema) {
        await CollectionModel.deleteOne({
            clientUserName,
            name: reqBody.name,
            applicationName,
            env
        });

        const parsedRules = JSON.parse(itemSchema.rules);

        const model: any = createModel({
            rules: parsedRules,
            name: itemSchema.name,
            applicationName,
            clientUserName
        });

        try {
            await model.collection.drop();
        }
        catch (e) {
            // console.log('here is no record man')
        }
    }
    else {
        throw new BadRequestError('Collection not found');
    }
    res.status(okayStatus).send(true);
}
