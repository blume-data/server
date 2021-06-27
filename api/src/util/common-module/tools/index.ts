import { randomBytes } from 'crypto';
import {Request} from 'express';
import {RuleType} from "@ranjodhbirkaur/constants";
import {SKIP_PROPERTIES_IN_ENTRIES} from "../utils";
import { flatObject } from '../../methods';

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
    items: any[],
    rules?: RuleType[]
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

// TODO later iwth flatten children  
export async function paginateData(data: PaginateDataType) {
    const {Model, req, where, rules} = data;
    let {items} = data;
    if(rules && rules.length && items) {
        let ruleMap: any = {};
        items = items.map(item => {
            let newItem: any = {};
            const flatItem = item.toObject();
            for(const property in flatItem) {
                if(Object.prototype.hasOwnProperty.call(flatItem, property)) {
                    if(!SKIP_PROPERTIES_IN_ENTRIES.includes(property)) {
                        if(ruleMap[property]) {
                            newItem[ruleMap[property]] = flatItem[property];
                        }
                        else {
                            const ruleExist = rules.find(rule => {
                                if(`${rule.type}${rule.indexNumber}` === property) {
                                    return rule;
                                }
                            });
                            if(ruleExist) {
                                ruleMap[property] = ruleExist.name;
                                newItem[`${ruleExist.name}`] = flatItem[property];
                            }
                        }
                    }
                    else {
                        newItem[property] = flatItem[property];
                    }
                }
            }
            return newItem;
        });
    }
    const {page} = getPageAndPerPage(req);
    const count = await Model.countDocuments(where);
    return {
        total: count,
        page,
        pageSize: (items && items.length) ? items.length : 0,
        data: items
    }
}