import React, {Suspense} from 'react';
import FormControl from "@material-ui/core/FormControl";
import {DescriptionText} from "../Form/DescriptionText";
import Grid from "@material-ui/core/Grid";
import {FieldType} from "../Form/interface";
import {FormLabel} from "@material-ui/core";
import Loader from "../Loader";
const PagalEditor = React.lazy(() => import('./PagalEditor'));

interface HtmlEditorType extends FieldType{
    value: string;
    setValue: any;
}

function HtmlEditor(props: HtmlEditorType) {

    const {value, setValue} = props;
    const {className, label, descriptionText='', placeholder} = props;
    console.log('value', value);
    return (

        <Grid className={`${className} app-text-box`}>
            <FormControl className={'text-box-form-control'}>
                <FormLabel component="legend">{label}</FormLabel>
                <Suspense fallback={<Loader />}>
                    <PagalEditor placeholder={placeholder} value={value} setValue={setValue} />
                </Suspense>
                <DescriptionText description={descriptionText} />
            </FormControl>
        </Grid>
    );
}

export default HtmlEditor;
