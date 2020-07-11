import {Request, Response} from 'express';

import {BadRequestError, NotAuthorizedError} from "@ranjodhbirkaur/common";
import {TempUser} from "../models/tempUser";
import {ClientUser} from "../models/clientUser";
import jwt from "jsonwebtoken";
import {AUTH_TOKEN, okayStatus, USER_NAME} from "../util/constants";

interface ReqIsUserEnabled extends Request{
    body: {
        userName: string
    },
}

export const isUserEnabled = async function (req: ReqIsUserEnabled, res: Response) {
    const modelProps = req.body;
    
    if (modelProps) {
        if (modelProps.userName) {
            const userExist = await ClientUser.findOne({userName: modelProps.userName, isEnabled: true});
            console.log('user', userExist);
            if (userExist) {
                res.status(okayStatus).send(true);
            }
            else {
                throw new NotAuthorizedError();
            }
        }
    }
};



