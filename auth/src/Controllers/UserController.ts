import {Request, Response} from 'express';

import {ClientUser} from '../models/clientUser';
import {BadRequestError} from "@ranjodhbirkaur/common";
import {TempUser} from "../models/tempUser";

interface Req extends Request{
    body: {
        userName: string
    }
}

export const isUserNameAvailable = async function (req: Req, res: Response) {
    const modelProps = req.body;
    
    if (modelProps) {
        if (modelProps.userName) {
            const userExist = await TempUser.findOne({userName: modelProps.userName});
            console.log('user exist', userExist);
            if (userExist) {
                res.status(200).send(false);
            }
            else {
                res.status(200).send(true);
            }
        }
    }
};

export const verifyEmailToken = async function (req: Req, res: Response) {
    const modelProps = req.query;

    if (modelProps) {
        /*if (modelProps.userName) {
            const userExist = await TempUser.findOne({userName: modelProps.userName});
            console.log('user exist', userExist);
            if (userExist) {
                res.status(200).send(false);
            }
            else {
                res.status(200).send(true);
            }
        }*/
    }
};


