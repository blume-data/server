import React from "react";
import {CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Form} from "../../../../../components/common/Form";
import Card from "@material-ui/core/Card";
import {ConfigField} from "../../../../../components/common/Form/interface";
import {ErrorMessagesType} from "@ranjodhbirkaur/constants";

interface RegisterType {
    onSubmit: (values: object[]) => void;
    fields: ConfigField[];
    title: string;
    response: string | ErrorMessagesType[];
}

export const CardForm = (props: RegisterType) => {
    const {onSubmit, fields, title, response} = props;
    return (
        <Card className={'auth-page-form-card'}>
            <CardContent>
                <Typography variant={'h3'}>{title}</Typography>
            </CardContent>
            <Form showClearButton={true} response={response} onSubmit={onSubmit} fields={fields} className={'auth-form'} />
        </Card>
    );
};