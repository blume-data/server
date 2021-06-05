import {Request, Response} from 'express';
import {BadRequestError, ID, okayStatus, sendSingleError} from "../../../util/common-module";
import {MAX_COLLECTION_LIMIT,} from "../../../util/constants";
import {CollectionModel} from "../../../db-models/Collection";
import {CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT, COLLECTION_ALREADY_EXIST} from "../../../util/Messages";

import {
    ENTRY_UPDATED_AT,
    ENTRY_UPDATED_BY,
    FIRST_NAME,
    LAST_NAME,
    trimCharactersAndNumbers
} from "@ranjodhbirkaur/constants";
import {createModel, createModelSchema, createStoreModelName, flatObject, getModel, sendOkayResponse} from "../../../util/methods";
import {DateTime} from "luxon";
import mongoose from "mongoose";
import {v4} from 'uuid';

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
            ['name', 'displayName', 'description', 'rules']);

        if(exist) {
            const update: any = {};
            if(reqBody.rules) {
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
