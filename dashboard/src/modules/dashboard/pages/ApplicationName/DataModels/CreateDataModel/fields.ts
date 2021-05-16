import {
    CHECKBOX,
    ConfigField, DATE_FORM_FIELD_TYPE,
    DROPDOWN,
    FORMATTED_TEXT, ONLY_DATE_FORM_FIELD_TYPE, OptionsType,
    TEXT
} from "../../../../../../components/common/Form/interface";
import {
    BOOLEAN_FIElD_TYPE,
    DATE_AND_TIME_FIElD_TYPE,
    DATE_FIElD_TYPE,
    dateEuropeReg,
    DateEuropeRegName,
    dateUsReg,
    DateUsRegName,
    DESCRIPTION,
    DISPLAY_NAME,
    emailReg,
    EmailRegName,
    FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN,
    FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN, FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
    FIELD_MAX,
    FIELD_MIN,
    HHTimeReg,
    hhTimeReg,
    HHTimeRegName,
    HhTimeRegName,
    INTEGER_FIElD_TYPE,
    IS_FIELD_REQUIRED,
    IS_FIELD_UNIQUE,
    JSON_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE,
    MEDIA_FIELD_TYPE, MULTIPLE_ASSETS_TYPE,
    NAME, ONE_TO_MANY_RELATION, ONE_TO_ONE_RELATION,
    REFERENCE_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE, SINGLE_ASSETS_TYPE,
    urlReg,
    UrlRegName,
    usPhoneReg,
    UsPhoneRegName,
    usZipReg,
    UsZipRegName
} from "@ranjodhbirkaur/constants";
import {
    FIELD_ALLOW_ONLY_SPECIFIC_VALUES_GROUP, FIELD_ASSET_TYPE,
    FIELD_DEFAULT_VALUE_GROUP,
    FIELD_DESCRIPTION,
    FIELD_ID,
    FIELD_LIMIT_CHARACTER_COUNT_GROUP,
    FIELD_LIMIT_VALUE_GROUP,
    FIELD_MATCH_SPECIFIC_PATTERN,
    FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
    FIELD_MATCH_SPECIFIC_PATTERN_STRING,
    FIELD_NAME,
    FIELD_NAME_GROUP,
    FIELD_ONLY_SPECIFIED_VALUES,
    FIELD_PROHIBIT_SPECIFIC_PATTERN,
    FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
    FIELD_REFERENCE_MODEL_GROUP,
    FIELD_REFERENCE_MODEL_NAME,
    FIELD_REFERENCE_MODEL_TYPE,
    MAX_VALUE,
    MIN_VALUE
} from "./constants";

interface GetNameFields {
    contentModelDisplayName: string;
    contentModelName: string;
    contentModelDescription: string;
}
export function getNameFields(props: GetNameFields) {
    const {
        contentModelDisplayName, contentModelName, contentModelDescription} = props;
    const nameFields: ConfigField[] = [
        {
            required: true,
            placeholder: 'Name',
            value: contentModelDisplayName,
            className: 'create-content-model-name',
            type: 'text',
            name: DISPLAY_NAME,
            label: 'Name',
            inputType: TEXT,
            descriptionText: 'name of the model',
            min: MIN_VALUE,
            max: MAX_VALUE
        },
        {
            min: MIN_VALUE,
            max: MAX_VALUE,
            required: false,
            placeholder: 'Name Identifier',
            value: contentModelName,
            className: 'create-content-model-name-identifier',
            type: 'text',
            name: NAME,
            disabled: !!contentModelName,
            label: 'Name Identifier',
            descriptionText: 'Generated from name (uniquely identify model)',
            inputType: TEXT,
        },
        {
            required: false,
            placeholder: 'Description',
            value: contentModelDescription,
            className: 'create-content-model-description',
            type: 'text',
            name: DESCRIPTION,
            label: 'Description',
            inputType: TEXT,
            min: MIN_VALUE,
            max: MAX_VALUE,
            descriptionText: 'Description of the model'
        },
    ];
    return nameFields;
}

interface GetPropertyNameFields {
    fieldDisplayName: string;
    fieldEditMode: boolean;
    fieldName: string;
    fieldDescription: string;
    fieldIsRequired: string;
    fieldIsUnique: string;
    fieldType: string;
    fieldMatchPattern: string;
    fieldMatchCustomPattern: string;
    fieldMatchPatternCustomError: string;
    fieldProhibitPattern: string;
    fieldProhibitPatternCustomError: string;
    fieldDefaultValue: string;
    fieldMax: string | number;
    fieldMin: string | number;
    fieldMinMaxCustomErrorMessage: string;
    fieldOnlySpecifiedValues: string;
    modelNames: OptionsType[];
    fieldAssetsType: string;
}
export function getPropertyFields(props: GetPropertyNameFields) {

    const {fieldType} = props;

    const propertyNameFields = () => {

        const hello: ConfigField[] = [
            // field name
            {
                required: true,
                placeholder: 'Field Name',
                value: props.fieldDisplayName,
                className: 'create-content-model-name-text-field',
                type: 'text',
                name: FIELD_NAME,
                min: MIN_VALUE,
                max: MAX_VALUE,
                label: 'Field Name',
                inputType: TEXT,
                descriptionText: 'Name of the field',
                groupName: FIELD_NAME_GROUP
            },
            // field id
            {
                disabled: props.fieldEditMode,
                required: false,
                placeholder: 'Field Identifier',
                value: props.fieldName,
                className: 'create-content-model-name-text-field',
                type: 'text',
                name: FIELD_ID,
                label: 'Field Identifier',
                inputType: TEXT,
                min: MIN_VALUE,
                max: MAX_VALUE,
                descriptionText: 'Generated from name (uniquely identify field)',
                groupName: FIELD_NAME_GROUP
            },
            // field description
            {
                required: false,
                placeholder: 'Field description',
                value: props.fieldDescription,
                className: 'create-content-model-name-text-field',
                type: 'text',
                name: FIELD_DESCRIPTION,
                label: 'Field description',
                inputType: TEXT,
                min: MIN_VALUE,
                max: MAX_VALUE,
                descriptionText: 'Description of field',
                groupName: FIELD_NAME_GROUP
            },
            // field is required
            {
                required: false,
                placeholder: 'Is required',
                value: props.fieldIsRequired,
                className: 'is-required-check-box',
                name: IS_FIELD_REQUIRED,
                label: 'Is required',
                inputType: CHECKBOX,
                descriptionText: 'You won\'t be able to publish an entry if this field is empty',
                groupName: FIELD_NAME_GROUP
            }
        ];

        // field is unique
        if(![DATE_FIElD_TYPE, JSON_FIELD_TYPE, REFERENCE_FIELD_TYPE, FORMATTED_TEXT, MEDIA_FIELD_TYPE].includes(fieldType)) {
            hello.push({
                required: false,
                placeholder: 'Is unique',
                value: props.fieldIsUnique,
                className: 'is-unique-check-box',
                name: IS_FIELD_UNIQUE,
                label: 'Is unique',
                inputType: CHECKBOX,
                descriptionText: 'You won\'t be able to publish an entry if there is an existing entry with identical content\n',
                groupName: FIELD_NAME_GROUP
            });
        }

        // Allow only specific pattern and prohibit a specific pattern
        if(props.fieldType === SHORT_STRING_FIElD_TYPE) {

            // select allowed pattern
            hello.push({
                groupName: FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
                required: false,
                placeholder: 'Match a specific pattern',
                value: `${props.fieldMatchPattern}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_MATCH_SPECIFIC_PATTERN,
                label: 'Match a specific pattern',
                options:[
                    {label: `Email (${emailReg})`, value: EmailRegName},
                    {label: `Url (${urlReg})`, value: UrlRegName},
                    {label: `Date US (${dateUsReg})`, value: DateUsRegName},
                    {label: `Date European (${dateEuropeReg})`, value: DateEuropeRegName},
                    {label: `12h Time (${hhTimeReg})`, value: HhTimeRegName},
                    {label: `24h Time (${HHTimeReg})`, value: HHTimeRegName},
                    {label: `Us phone number (${usPhoneReg})`, value: UsPhoneRegName},
                    {label: `Us zip code (${usZipReg})`, value: UsZipRegName}
                ],
                inputType: DROPDOWN,
                descriptionText: 'Make this field match a pattern: e-mail address, URI, or a custom regular expression'
            });
            // allowed custom pattern
            hello.push({
                required: false,
                placeholder: 'Match a custom specific pattern',
                value: `${props.fieldMatchCustomPattern}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_MATCH_SPECIFIC_PATTERN_STRING,
                label: 'Match a custom specific pattern',
                inputType: TEXT,
                descriptionText: 'Make this field match a custom regular expression',
                groupName: FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
            });

            // allowed pattern custom error message
            hello.push({
                required: false,
                placeholder: 'Match specific pattern custom error message',
                value: `${props.fieldMatchPatternCustomError}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
                label: 'Match specific pattern custom error message',
                inputType: TEXT,
                descriptionText: 'This message will be sent if the value does not match pattern',
                groupName: FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
            });

            // prohibit pattern
            hello.push({
                required: false,
                placeholder: 'Prohibit a specific pattern',
                value: `${props.fieldProhibitPattern}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_PROHIBIT_SPECIFIC_PATTERN,
                label: 'Prohibit a specific pattern',
                inputType: TEXT,
                groupName: FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
                descriptionText: 'Make this field invalid when a pattern is matched: custom regular expression (e.g. bad word list)'
            });

            // prohibit pattern custom error message
            hello.push({
                required: false,
                placeholder: 'Prohibit specific pattern custom error message',
                value: `${props.fieldProhibitPatternCustomError}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN,
                label: 'Prohibit specific pattern custom error message',
                inputType: TEXT,
                descriptionText: 'Custom message will be sent if the value matches this pattern',
                groupName: FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
            });
        }

        // Default Value field
        if(props.fieldType !== REFERENCE_FIELD_TYPE && fieldType !== JSON_FIELD_TYPE) {
            let inputType = '';
            let placeholder = 'Default value';
            let type = 'string';
            switch (fieldType) {
                case INTEGER_FIElD_TYPE:{
                    type = 'number';
                    inputType = TEXT;
                    break;
                }
                case LONG_STRING_FIELD_TYPE: {
                    inputType = FORMATTED_TEXT;
                    break;
                }
                case BOOLEAN_FIElD_TYPE: {
                    inputType = CHECKBOX;
                    placeholder = 'true';
                    break;
                }
                case DATE_AND_TIME_FIElD_TYPE: {
                    inputType = DATE_FORM_FIELD_TYPE;
                    placeholder = 'Default Date';
                    type = DATE_AND_TIME_FIElD_TYPE;
                    break;
                }
                case DATE_FIElD_TYPE: {
                    inputType = ONLY_DATE_FORM_FIELD_TYPE;
                    placeholder = 'Default Date';
                    type = ONLY_DATE_FORM_FIELD_TYPE
                    break;
                }
                default: {
                    inputType = TEXT;
                    break;
                }
            }
            hello.push({
                required: false,
                placeholder: placeholder,
                value: props.fieldDefaultValue,
                className: '',
                name: 'default',
                label: placeholder,
                type,
                inputType,
                descriptionText: 'Default value if the field is left blank',
                groupName: FIELD_DEFAULT_VALUE_GROUP
            });
        }

        // Min max and only allowed values
        if(fieldType === SHORT_STRING_FIElD_TYPE || fieldType === INTEGER_FIElD_TYPE) {
            // Max count
            hello.push({
                required: false,
                placeholder: fieldType ===SHORT_STRING_FIElD_TYPE ? 'Max character count' : 'Max value',
                value: `${props.fieldMax}`,
                className: 'field-max-count',
                type: 'number',
                name: FIELD_MAX,
                label: fieldType === SHORT_STRING_FIElD_TYPE ? 'Max character count' : 'Max value',
                inputType: TEXT,
                groupName: fieldType === SHORT_STRING_FIElD_TYPE ? FIELD_LIMIT_CHARACTER_COUNT_GROUP : FIELD_LIMIT_VALUE_GROUP,
                descriptionText: fieldType === SHORT_STRING_FIElD_TYPE ? 'Specify a maximum allowed number of characters' : 'Specify a maximum allowed value'
            });
            // Min count
            hello.push({
                required: false,
                placeholder: fieldType ===SHORT_STRING_FIElD_TYPE ? 'Min character count' : 'Min value',
                value: `${props.fieldMin}`,
                className: 'field-min-count',
                type: 'number',
                name: FIELD_MIN,
                label: fieldType === SHORT_STRING_FIElD_TYPE ? 'Min character count' : 'Min value',
                inputType: TEXT,
                groupName: fieldType === SHORT_STRING_FIElD_TYPE ? FIELD_LIMIT_CHARACTER_COUNT_GROUP : FIELD_LIMIT_VALUE_GROUP,
                descriptionText: fieldType === SHORT_STRING_FIElD_TYPE ? 'Specify a minimum allowed number of characters' : 'Specify a minimum allowed value'
            });
            // Max Min Custom count
            hello.push({
                required: false,
                placeholder: fieldType === SHORT_STRING_FIElD_TYPE ? 'Character count custom error message' : 'Allowed value custom error message',
                value: `${props.fieldMinMaxCustomErrorMessage}`,
                className: 'field-custom-error-message',
                type: 'text',
                name: FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
                groupName: fieldType === SHORT_STRING_FIElD_TYPE ? FIELD_LIMIT_CHARACTER_COUNT_GROUP : FIELD_LIMIT_VALUE_GROUP,
                label: fieldType === SHORT_STRING_FIElD_TYPE ? 'Character count custom error message' : 'Allowed value custom error message',
                descriptionText: `Specify a custom error message if ${fieldType === SHORT_STRING_FIElD_TYPE ? 'characters are' : 'value is'} not within specified range`,
                inputType: TEXT
            });
            // only allowed values
            hello.push({
                required: false,
                placeholder: 'Accept only specified values',
                value: `${props.fieldOnlySpecifiedValues}`,
                className: 'field-min-count',
                type: 'text',
                name: FIELD_ONLY_SPECIFIED_VALUES,
                label: 'Accept only specified values',
                inputType: TEXT,
                groupName: FIELD_ALLOW_ONLY_SPECIFIC_VALUES_GROUP,
                descriptionText: 'An entry won\'t be valid if the field value is not in the list of specified values (Add values separated by comma)'
            });
        }

        if(fieldType === REFERENCE_FIELD_TYPE) {

            hello.push({
                groupName: FIELD_REFERENCE_MODEL_GROUP,
                required: false,
                placeholder: 'Select reference model name',
                value: ``,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_REFERENCE_MODEL_NAME,
                label: 'Select reference model name',
                options: props.modelNames,
                inputType: DROPDOWN,
                descriptionText: 'Select a model name to add reference to'
            });
            hello.push({
                groupName: FIELD_REFERENCE_MODEL_GROUP,
                required: false,
                placeholder: 'Select type of reference',
                value: ``,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_REFERENCE_MODEL_TYPE,
                label: 'Select type of reference',
                options: [
                    {label: 'one to one relation', value: ONE_TO_ONE_RELATION},
                    {label: 'one to many relation', value: ONE_TO_MANY_RELATION}
                ],
                inputType: DROPDOWN,
                descriptionText: 'Select type of reference'
            });
        }

        if(fieldType === MEDIA_FIELD_TYPE) {
            hello.push({
                groupName: FIELD_NAME_GROUP,
                required: false,
                placeholder: 'Select type of media storage',
                value: props.fieldAssetsType,
                className: 'field-min-count',
                type: TEXT,
                name: FIELD_ASSET_TYPE,
                label: 'Select type of reference',
                options: [
                    {label: 'single media', value: SINGLE_ASSETS_TYPE},
                    {label: 'multiple media', value: MULTIPLE_ASSETS_TYPE}
                ],
                inputType: DROPDOWN,
                descriptionText: 'Select type of media storage'
            })
        }
        return hello;
    };
    return propertyNameFields;
}