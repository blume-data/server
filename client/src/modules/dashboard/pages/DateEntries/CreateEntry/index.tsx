import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {getItemFromLocalStorage} from "../../../../../utils/tools";
import {
    APPLICATION_NAME, BOOLEAN_FIElD_TYPE,
    CLIENT_USER_NAME, DATE_FIElD_TYPE, ErrorMessagesType,
    INTEGER_FIElD_TYPE, JSON_FIELD_TYPE, LONG_STRING_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE
} from "@ranjodhbirkaur/constants";
import {doGetRequest, doPostRequest} from "../../../../../utils/baseApi";
import {getBaseUrl} from "../../../../../utils/urls";
import {RuleType} from "../../../../../../../data/src/util/interface";
import Loader from "../../../../../components/common/Loader";
import {
    CHECKBOX,
    ConfigField,
    DATE_FORM_FIELD_TYPE,
    FORMATTED_TEXT, JSON_TEXT,
    TEXT
} from "../../../../../components/common/Form/interface";
import {Form} from "../../../../../components/common/Form";
import {useParams} from "react-router";

type PropsFromRedux = ConnectedProps<typeof connector>;

const CreateEntry = (props: PropsFromRedux) => {

    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    const {env, applicationName, GetCollectionNamesUrl, language, StoreUrl} = props;
    const [rules, setRules] = useState<RuleType[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<string | ErrorMessagesType[]>('');

    const {modelName} = useParams();

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
            //  console.log('res', response);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, [GetCollectionNamesUrl]);

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
                case DATE_FIElD_TYPE: {
                    inputType = DATE_FORM_FIELD_TYPE;
                    type = 'date';
                    break;
                }
                case BOOLEAN_FIElD_TYPE: {
                    inputType = CHECKBOX;
                    type = 'text';
                    break;
                }
                case JSON_FIELD_TYPE: {
                    inputType = JSON_TEXT;
                    type = 'text';
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

    async function createEntry(values: any) {

        if(StoreUrl && values && values.length) {
            const url = StoreUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(':modelName', modelName)
                .replace(`:${APPLICATION_NAME}`,applicationName);

            let data: any = {};

            values.forEach((valueItem: {name: string; value: string}) => {

                if(rules && rules.length) {
                    const exist = rules.find(rule => rule.name === valueItem.name);
                    if(exist) {
                        if(exist.type === BOOLEAN_FIElD_TYPE) {
                            data[valueItem.name] = valueItem.value === 'true';
                        }
                        else {
                            data[valueItem.name] = valueItem.value;
                        }
                    }
                }
            });

            console.log('data', data, values, rules);


            const res = await doPostRequest(`${getBaseUrl()}${url}`, data, true);

        }

    }

    function onsubmit(values: any) {
        createEntry(values);

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