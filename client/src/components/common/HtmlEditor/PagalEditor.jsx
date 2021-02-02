import React from "react";
import { Editor } from '@tinymce/tinymce-react';
import './style.scss';
import Paper from "@material-ui/core/Paper";


export const PagalEditor = ({value, setValue, placeholder = 'Edit Your Content Here!'}) => {

    const handleChange = (str) => {
        setValue(str);
    };

    return(
        <div className={'text-editor field input-text-component'}>
            <Paper elevation={3} className="control">
                <Editor
                    apiKey={'m406r3gdjqg4dvjs4r10p0njjw4zvh4yczzv8bmog98865f4'}
                    initialValue={value}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar:
                            'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
                    }}
                    onEditorChange={handleChange}
                />
            </Paper>
        </div>
    );
};