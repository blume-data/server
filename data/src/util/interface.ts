import {
    FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
    FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
    FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN,
    REFERENCE_MODEL_NAME, REFERENCE_MODEL_TYPE
} from "@ranjodhbirkaur/constants";

export interface RuleType {
    type: string;
    name: string;
    displayName: string;
    description: string;
    required: boolean;
    unique: boolean;
    default: any;
    min: number;
    max: number;
    matchSpecificPattern: string;
    matchCustomSpecificPattern: string;
    prohibitSpecificPattern: string;
    [FIELD_CUSTOM_ERROR_MSG_MIN_MAX]: string;
    [FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN]: string;
    [FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]: string;
    onlyAllowedValues: string;
    [REFERENCE_MODEL_NAME]: string;
    [REFERENCE_MODEL_TYPE]: string;
}


export interface ModelLoggerBodyType {
    modelName: string;
    time: string;
    action: 'create' | 'update',
    actor: string;
    clientType: string;
}