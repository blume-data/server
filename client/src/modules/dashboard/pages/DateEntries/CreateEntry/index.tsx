import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {getItemFromLocalStorage} from "../../../../../utils/tools";
import {
    APPLICATION_NAME,
    CLIENT_USER_NAME, ErrorMessagesType,
    INTEGER_FIElD_TYPE, LONG_STRING_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE
} from "@ranjodhbirkaur/constants";
import {doGetRequest} from "../../../../../utils/baseApi";
import {getBaseUrl} from "../../../../../utils/urls";
import {RuleType} from "../../../../../../../data/src/util/interface";
import Loader from "../../../../../components/common/Loader";
import {ConfigField, FORMATTED_TEXT, TEXT} from "../../../../../components/common/Form/interface";
import {Form} from "../../../../../components/common/Form";

type PropsFromRedux = ConnectedProps<typeof connector>;
type CreateEntryProps = PropsFromRedux & {
    modelName: string;
}

const CreateEntry = (props: CreateEntryProps) => {

    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    const {env, applicationName, GetCollectionNamesUrl, language, modelName} = props;
    const [rules, setRules] = useState<RuleType[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<string | ErrorMessagesType[]>('');

    async function getData() {
        if(GetCollectionNamesUrl) {
            setIsLoading(true);
            const url = GetCollectionNamesUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(`:${APPLICATION_NAME}`,applicationName);

            const response = await doGetRequest(
                `${getBaseUrl()}${url}?name=${modelName ? modelName : ''}`,
                {},
                true
            );
            if(response && !response.errors && response.length) {
                setRules(JSON.parse(response[0].rules));
            }
            console.log('res', response);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    console.log('rules', rules);


    let fields: ConfigField[] = [];

    if(rules) {
        rules.forEach(rule => {

            let inputType = 'text';
            let type = 'text';
            switch (rule.type) {
                case SHORT_STRING_FIElD_TYPE: {
                    inputType = TEXT;
                    type = 'text';
                    break;
                }
                case LONG_STRING_FIELD_TYPE: {
                    inputType = FORMATTED_TEXT;
                    type = 'text'
                    break;
                }
                case INTEGER_FIElD_TYPE: {
                    inputType = TEXT;
                    type = 'number';
                    break;
                }

            }

            fields.push({
                required: !!rule.required,
                type,
                inputType,
                label: rule.displayName ? rule.displayName : '',
                placeholder: rule.displayName ? rule.displayName : '',
                min: rule.min,
                max: rule.max,
                className: '',
                value: '',
                name: rule.name,
                descriptionText: rule.description
            })
        })
    }

    function onsubmit() {

    }

    return (
        <Grid>
            {isLoading ? <Loader /> : null}

            <Grid className="create-entry-form-container">
                <Form
                    response={response}
                    submitButtonName={'Save model name'}
                    className={'create-content-model-form'}
                    fields={fields}
                    onSubmit={onsubmit}
                    />
            </Grid>

        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
        StoreUrl: state.routeAddress.routes.data?.StoreUrl
    }
};

const connector = connect(mapState);
export default connector(CreateEntry);