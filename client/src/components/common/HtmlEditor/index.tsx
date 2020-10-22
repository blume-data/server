import React from 'react';
import {PagalEditor} from "./PagalEditor";

interface HtmlEditorType {
    value: string;
    setValue: any
}

function HtmlEditor(props: HtmlEditorType) {

    const {value, setValue} = props;
    console.log('value', value);

    return (
        <PagalEditor value={value} setValue={setValue} />
    );
}

export default HtmlEditor;
