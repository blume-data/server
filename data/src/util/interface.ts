import {FIELD_CUSTOM_ERROR_MSG_MIN_MAX} from "@ranjodhbirkaur/constants";

export interface RuleType {
    type: string;
    name: string;
    displayName?: string;
    description?: string;
    required?: boolean;
    unique?: boolean;
    default?: any;
    min?: number;
    max?: number;
    [FIELD_CUSTOM_ERROR_MSG_MIN_MAX]?: string;
    isEmail?: boolean;
    isPassword?: boolean;
}


export interface ModelLoggerBodyType {
    modelName: string;
    time: string;
    action: 'create' | 'update',
    actor: string;
    clientType: string;
}