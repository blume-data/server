import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import {DescriptionText} from "../Form/DescriptionText";
import Grid from "@material-ui/core/Grid";
import {FieldType} from "../Form/interface";
import {FormLabel} from "@material-ui/core";
import {PagalEditor} from './PagalEditor';

interface HtmlEditorType extends FieldType{
    value: string;
    setValue: any;
}

function HtmlEditor(props: HtmlEditorType) {

    const {value, setValue} = props;
    const {className, label, descriptionText='', placeholder} = props;
    return (

        <Grid className={`${className} app-text-box`}>
            <FormControl className={'text-box-form-control'}>
                <FormLabel component="legend">{label}</FormLabel>
                <PagalEditor placeholder={placeholder} value={value} setValue={setValue} />
                <DescriptionText description={descriptionText} />
            </FormControl>
        </Grid>
    );
}

export default HtmlEditor;
