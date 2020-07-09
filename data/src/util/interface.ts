export interface RuleType {
    type: string;
    name: string;
    required?: boolean;
    unique?: boolean;
    default?: any;
}