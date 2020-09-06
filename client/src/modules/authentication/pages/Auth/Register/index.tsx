import React from "react";
import {CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Form} from "../../../../../components/common/Form";
import Card from "@material-ui/core/Card";
import {ErrorMessagesType} from "@ranjodhbirkaur/constants";
import {ConfigField} from "../../../../../components/common/Form/interface";

interface RegisterType {
    onSubmit: (values: object[]) => Promise<string | ErrorMessagesType[]>;
    fields: ConfigField[];
    title: string;
}

export const Register = (props: RegisterType) => {
    const {onSubmit, fields, title} = props;
    return (
        <Card className={'auth-page-form-card'}>
            <CardContent>
                <Typography variant={'h3'}>{title}</Typography>
            </CardContent>
            <Form onSubmit={onSubmit} fields={fields} className={'auth-form'} />
        </Card>
    );
};