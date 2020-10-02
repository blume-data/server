import {MAX_COLLECTION_LIMIT} from "../util/constants";

export const COLLECTION_ALREADY_EXIST = 'collection already exist';
export const INVALID_RULES_MESSAGE = 'Body should be array of type and name properties';
export const REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN = 'required property in the rules should be boolean';
export const UNIQUE_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN = 'unique property in the rules should be boolean';
export const IS_EMAIL_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN = 'isEmail property in the rules should be boolean';
export const EMAIL_PROPERTY_IN_RULES_SHOULD_BE_STRING = 'to set isEmail property, type should be string in the rules';
export const PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_STRING = 'to set isPassword property, type should be string in the rules';
export const IS_PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN = 'isPassword property in the rules should be boolean';
export const DEFAULT_VALUE_SHOULD_BE_OF_SPECIFIED_TYPE = 'default value should be of type ';
export const CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT = 'cannot create more than '+MAX_COLLECTION_LIMIT+' collections';

export const COLLECTION_NOT_FOUND = 'Collection not found';
export const ALL_CONNECTIONS_AND_DB_CAPACITY_FULL = 'ALL CONNECTIONS AND DB CAPACITY FULL';

export const PARAM_SHOULD_BE_UNIQUE = 'should be unique';


/*Role Message*/

export const ROLE_NAME_EXIST = 'role exist';


/*Permission Message*/

export const PERMISSION_NAME_EXIST = 'permission with same name and type exist';

/*ENV*/

export const ENV_IS_NOT_SUPPORTED = 'env is not supported';

export const APPLICATION_NAME_ALREADY_EXIST = 'Application name already exist';