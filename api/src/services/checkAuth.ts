import {Request, Response, NextFunction} from 'express';
import {
    JWT_ID,
    sendSingleError, Is_Enabled, CLIENT_USER_NAME, ID, verifyJwt, BadRequestError,
} from "../util/common-module";
import {UserModel} from "../db-models/UserModel";
import { clientType, clientUserType, freeUserType, superVisorUserType, supportUserType, USER_NAME } from '@ranjodhbirkaur/constants';
import { CollectionModel } from '../db-models/Collection';
import { MODEL_NOT_FOUND } from '../util/Messages';

/*
* Check isEnabled jwt_id and client type
* */
export async function checkAuth(req: Request, res: Response, next: NextFunction ) {


    const clientUserName = req.params[CLIENT_USER_NAME];

    try {
        let modelSetting = {};
        const requestForEntries = req.path.includes('/entry/');
        // If request is not entries
        // Check is the model is public
        // If model is public by pass authentication
        if(requestForEntries && req.params) {
            const modelName = req.params['modelName'];
            const clientUserName  = req.params && req.params.clientUserName;
            const applicationName  = req.params && req.params.applicationName;
            
            const env = req.params && req.params.env;
            if(modelName) {
                // Search in data base the permissions of this model
                const query = CollectionModel.find({
                    name: modelName,
                    clientUserName,
                    applicationName,
                    env
                }, ['settingId', 'id']);
                query.populate({
                    path: 'setting', select: ['getRestrictedUserGroupIds', 'postRestrictedUserGroupIds', 'putRestrictedUserGroupIds', 'deleteRestrictedUserGroupIds', 'getPermittedUserGroupIds', 'postPermittedUserGroupIds', 'putPermittedUserGroupIds', 'deletePermittedUserGroupIds']
                });
                const model: any = await query;
                
                // If the model is public
                // Allow all operations
                if(model?.length && model[0]?.setting?.isPublic) {
                    return next();
                }
                else if(model?.length && model[0]?.setting) {

                    // If the permitted field is blank the method is public to all
                    if(model[0]?.setting[`${req.method.toLowerCase()}PermittedUserGroupIds`]?.length === 0 && model[0]?.setting[`${req.method.toLowerCase()}RestrictedUserGroupIds`]?.length === 0) {
                        console.log("Is empty", model[0]?.setting[`${req.method.toLowerCase()}PermittedUserGroupIds`])
                        return next();
                    }
                    modelSetting = model[0]?.setting;
                }
                // Model is not found
                else {
                    throw new BadRequestError(MODEL_NOT_FOUND);
                }
            }
        }
        
        const payload = verifyJwt(req);
        if(!payload) {
            return notAuthorized(res);
        }
        else {
            return validateJWTInfo({
                payload, res, req, next, clientUserName, requestForEntries: modelSetting
            });
        }
    }
    // If JWT is not valid
    catch (e) {
        if (process.env.NODE_ENV === 'test') {
            return next();
        }
        return notAuthorized(res);
    }
}

// Verify JWT info
async function validateJWTInfo(params: {payload: any, clientUserName: string, req: Request, next: NextFunction, res: Response, requestForEntries?: any}) {

    const {payload, req, clientUserName, res, next, requestForEntries} = params;

    // check if the jwt_id matches
    if(payload && payload[JWT_ID] && payload[clientType] && payload[USER_NAME]) {

        

        switch (payload[clientType]) {
            // main user
            case clientUserType: {
                if(await setCurrentUser({
                    req, clientUserName, payload, res
                })) {
                    next();
                }
                // username does not match username in JWT
                else {
                    return notAuthorized(res);
                }
                break;
            }
            case superVisorUserType: {
                // Has acess to every thing in all spaces
                break;
            }
            case supportUserType: {
                // Has access to every thing in a perticular space
                break;
            }
            case freeUserType: {
                // Has access to certain operaions on in entries
                
                if(requestForEntries) {
                    // Check permission
                    
                        const currentUser: any = await setCurrentUser({
                            req, clientUserName, payload, res, fetchUserGroup: true
                        });

                        if(currentUser && currentUser?.userGroups[0]?.id) {
                            // check permissions
                            const groupId = currentUser?.userGroups[0]?.id || '';
                            // CHeck if user is restricted
                            if(requestForEntries[`${req.method.toLowerCase()}RestrictedUserGroupIds`]?.includes(groupId)) {
                                return notAuthorized(res);
                            }
                            // Check if has permission
                            else if(requestForEntries[`${req.method.toLowerCase()}PermittedUserGroupIds`]?.includes(groupId)) {
                                return next();
                            }
                        }
                    
                }

                notAuthorized(res)

                break;
            }
        }

    }
}

/*
* Send Not Authorised Response
*/
function notAuthorized(res: Response) {
    sendSingleError(res, 'Not authorised');
}

// Get user details
async function setCurrentUser(props: {req: Request, payload: any, clientUserName: string, fetchUserGroup?: boolean, res: Response}) {

    const {req, payload, fetchUserGroup=false, res} = props;

    const query = UserModel.findOne({
        [USER_NAME]: payload[USER_NAME], [JWT_ID]: payload[JWT_ID], [Is_Enabled]: true
    }, [JWT_ID, Is_Enabled, USER_NAME, 'id', (fetchUserGroup ? 'userGroupIds' : '')]);

    if(fetchUserGroup) {
        query.populate({
            path: 'userGroups', select: 'id'
        });
    }

    const userExist = await query;
    
    if(userExist && userExist[USER_NAME] === payload[USER_NAME]) {
        req.currentUser = {
            id: userExist.id,
            [USER_NAME]: payload[USER_NAME],
            [clientType]: payload[clientType]
        };
        return userExist;
    }
    else {
        notAuthorized(res);
        return undefined;
    }
}