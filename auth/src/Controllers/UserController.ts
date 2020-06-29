import {Request, Response} from 'express';

import {BadRequestError} from "@ranjodhbirkaur/common";
import {TempUser} from "../models/tempUser";
import {ClientUser} from "../models/clientUser";
import jwt from "jsonwebtoken";
import {AUTH_TOKEN, okayStatus, USER_NAME} from "../util/constants";

interface ReqIsUserNameAvailable extends Request{
    body: {
        userName: string
    },
}

interface ReqValidateEmail extends Request{
    query: {
        email: string,
        token: string
    },
}

export const isUserNameAvailable = async function (req: ReqIsUserNameAvailable, res: Response) {
    const modelProps = req.body;
    
    if (modelProps) {
        if (modelProps.userName) {
            const userExist = await TempUser.findOne({userName: modelProps.userName});
            if (userExist) {
                throw new BadRequestError('Username not available');
            }
            else {
                res.status(okayStatus).send(true);
            }
        }
    }
};

export const verifyEmailToken = async function (req: ReqValidateEmail, res: Response) {
    const modelProps = req.query;

    const clientUserExist = await ClientUser.findOne({email: modelProps.email});
    if (clientUserExist) {
        throw new BadRequestError('Invalid Request');
    }
    else {
        const userExist = await TempUser.findOne({email: modelProps.email, verificationToken: modelProps.token});

        if (userExist) {

            const newUser = await ClientUser.build({
                email: userExist.email,
                password: userExist.password,
                firstName: userExist.firstName,
                lastName: userExist.lastName,
                userName: userExist.userName,
                role: userExist.role
            });

            await newUser.save();

            const payload = {
                id: newUser.id,
                email: newUser.email,
            };

            // Generate JWT
            const userJwt = jwt.sign(
                payload,
                process.env.JWT_KEY!
            );

            // Store it on session object
            req.session = {
                jwt: userJwt,
            };

            res.status(okayStatus).send({... payload, [AUTH_TOKEN]: userJwt, [USER_NAME]: newUser.userName});

            TempUser.deleteMany({email: modelProps.email}).then(() => {});

        }
        else {
            throw new BadRequestError('Token not valid');
        }
    }
};


