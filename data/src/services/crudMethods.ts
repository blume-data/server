import {Response} from 'express';
import {BadRequestError} from "@ranjodhbirkaur/common";
import {okayStatus} from "../util/constants";
import {Model} from "mongoose";
export const createRecord = async function (modelProps: any,Model: Model<any>,res?: Response | null,) {

    return Model.create(modelProps)
        .then((response:any) => {
            if(response){
                if (res) {
                    res.status(okayStatus).send('Created');
                }
                else {
                    return response;
                }
            }
            else{
                if (res) {
                    return null;
                }
                else {
                    throw new BadRequestError('failed to create');
                }
            }
        })
        .catch((err: any) => {
            console.log('Error in creating record', err);
            if (res) {
                return null;
            }
            else {
                throw new BadRequestError('Error');
            }
        });
};