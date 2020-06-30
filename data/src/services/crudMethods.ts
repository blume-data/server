import {Response} from 'express';
import {BadRequestError} from "@ranjodhbirkaur/common";
import {okayStatus} from "../util/constants";
export const createMethod = function (res: Response,modelProps: any,Model: any) {

    Model.create(modelProps)
        .then((response:any) => {
            if(response){
                res.status(okayStatus).send('Created');
            }
            else{
                throw new BadRequestError('failed');
            }
        })
        .catch((err: any) => {
            throw new BadRequestError('Error');
        });
};