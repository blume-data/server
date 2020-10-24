export interface RuleType {
    type: string;
    name: string;
    displayName?: string;
    description?: string;
    required?: boolean;
    unique?: boolean;
    default?: any;
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