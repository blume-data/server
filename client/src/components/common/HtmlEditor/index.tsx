import React from 'react';
import loadable from "@loadable/component";

const PagalEditor = loadable(() => import('./PagalEditor'), {
    resolveComponent: component => component.PagalEditor,
});

interface HtmlEditorType {
    value: string;
    setValue: any;
}

function HtmlEditor(props: HtmlEditorType) {

    const {value, setValue} = props;
    return (
        <PagalEditor value={value} setValue={setValue} />
    );
}

export default HtmlEditor;
