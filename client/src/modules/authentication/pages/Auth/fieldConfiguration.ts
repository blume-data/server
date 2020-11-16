import {ConfigField, TEXT} from "../../../../components/common/Form/interface";
import {SIGN_IN, SIGN_UP, VERIFY_EMAIL} from "./index";

function getEmail(value: string) {
    return {
        inputType: TEXT,
        placeholder: 'Email',
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
        value: value ? value: '',
        className: 'auth-email-text-box',
    }
}

const password = {
        inputType: TEXT,
        placeholder: 'Password',
        label: 'Password',
        name: 'password',
        type: 'password',
        required: true,
        value: '',
        className: 'auth-password-text-box',
    };
const firstName = {
        inputType: TEXT,
        placeholder: 'First Name',
        label: 'First Name',
        name: 'firstName',
        type: 'text',
        required: true,
        value: '',
        helperText: '',
        className: 'auth-first-name-text-box',
    };
const lastName = {
        inputType: TEXT,
        placeholder: 'Last Name',
        label: 'Last Name',
        name: 'lastName',
        type: 'text',
        required: true,
        value: '',
        className: 'auth-last-name-text-box',
    };
const userName = {
        inputType: TEXT,
        placeholder: 'Username',
        label: 'Username',
        name: 'userName',
        type: 'text',
        required: true,
        value: '',
        className: 'auth-user-name-text-box',
    };

/*Get Token Fields*/
function getToken(value: string) {
    return {
        inputType: TEXT,
        placeholder: 'verification token',
        label: 'token',
        name: 'verificationToken',
        type: 'text',
        required: true,
        value: value ? value : '',
        className: 'auth-user-name-text-box',
    };
}

export function getFieldConfiguration(step: string, defaultValues?: any ): ConfigField[] {
    let fields: ConfigField[] = [];

    const defaultEmailValue = (defaultValues && defaultValues.email) ? defaultValues.email : '';
    const defaultTokenValue = (defaultValues && defaultValues.token) ? defaultValues.token : '';
    switch (step) {
        case SIGN_UP: {
            fields = [firstName, lastName, userName, getEmail(defaultEmailValue), password];
            return fields;
        }
        case SIGN_IN: {
            return [getEmail(defaultEmailValue), password];
        }
        case VERIFY_EMAIL: {
            return [getEmail(defaultEmailValue), getToken(defaultTokenValue)];
        }
    }


    return fields;
}