export interface RuleType {
    type: string;
    name: string;
    required?: boolean;
    unique?: boolean;
    default?: any;
    isEmail?: boolean;
    isPassword?: boolean;
}

export interface ErrorMessages {
    field?: string;
    message: string;
}

export interface DbConnectionModel {
    model: any;
    dbConnection?: any;
}