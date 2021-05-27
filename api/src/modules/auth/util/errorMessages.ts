import { adminType, clientType } from "@ranjodhbirkaur/constants";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "../../../util/common-module";

export const EmailInUseMessage = 'An account with this Email address already exist';
export const UserNameNotAvailableMessage = 'Username is not available';

// validator error message for invalid email
export const InValidEmailMessage = 'Email must be valid';

export const InvalidLoginCredentialsMessage = 'Login credentials are not valid';

export const ADMIN_USER_TYPE_NOT_VALID = `${adminType} is not valid`;
export const CLIENT_USER_TYPE_NOT_VALID = `${clientType} is not valid`;
export const CLIENT_USER_NAME_NOT_VALID = `${CLIENT_USER_NAME} is not valid`;
export const APPLICATION_NAME_NOT_VALID = `${APPLICATION_NAME} is not valid`;

export const TOKEN_IS_REQUIRED_MESSAGE = 'token is required';
export const TOKEN_NOT_VALID = 'Token not valid';

export const USER_NAME_NOT_AVAILABLE = 'Username not available';

export const PERMISSION_IS_NOT_VALID = 'Permission is not valid';
export const PERMISSION_IS_NOT_PRESENT = 'Permission is not present';
export const ROLE_ALREADY_EXIST = 'Role is already created';