import { randomBytes } from 'crypto';
import {Request} from 'express';

export const RANDOM_STRING = function (minSize=4) {
    return randomBytes(minSize).toString('hex')
};

export function validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function isTestEnv() {
    return process.env.NODE_ENV === 'test';
}

export * from './jwt';
export * from './validation';
export * from './logs';

interface PaginateDataType {
    Model: any,
    req: Request,
    where: any,
    items: any[]
}
export function getPageAndPerPage(req: Request): {page: Number, perPage: Number} {
    let {page=1, perPage=10} = req.query;
    page = ((Number(page) - 1) < 0) ? 0 : (Number(page) - 1);
    perPage = Number(perPage) || 10;
    if(perPage > 50) {
        perPage = 50;
    }
    return {page, perPage};
}

export async function paginateData(data: PaginateDataType) {
    const {Model, req, where, items} = data;
    const {page} = getPageAndPerPage(req);
    const count = await Model.countDocuments(where);
    return {
        total: count,
        page,
        pageSize: (items && items.length) ? items.length : 0,
        data: items
    }
}

export function generateArray(size: number) {
    const arr: number[] = [];
    for(let i=1; i<=20; i++) {
        arr.push(i);
    }
    return arr;
}