import React from "react";
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import './froala.css';
import 'font-awesome/css/font-awesome.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditor from 'react-froala-wysiwyg';

import './style.scss';


export const PagalEditor = ({value, setValue}) => {

    const handleChange = (str) => {
        setValue(str);
    };
    const config = {
        autoSave: true,
        charCounterCount: true,
        fontFamilySelection: true,
        fontSizeSelection: true,
        /*imageMaxSize: 16 * 1024 * 1024,
        imageUploadParam: 'file',
        imageUploadParams: {
            id: 'my_editor'
        },*/
        //imageUploadMethod: 'POST',
        //imageUploadURL: '/api/d/cms/uploads/image',
        placeholderText: 'Edit Your Content Here!',
        pluginsEnabled: [
            'align',
            'charCounter',
            'codeBeautifier',
            'codeView',
            'colors',
            'draggable',
            'emoticons',
            'entities',
            'fontFamily',
            'fontSize',
            'fullscreen',
            'help',
            'image',
            'inlineClass',
            'inlineStyle',
            'link',
            'lists',
            'paragraphFormat',
            'paragraphStyle',
            'print',
            'quote',
            'save',
            'specialCharacters',
            'table',
            'url',
            'video',
            'wordPaste'
        ],

        //saveInterval: 2500,

        // Set the save param.
        //saveParam: 'content',

        // Set the save URL.
        //saveURL: 'http://localhost:3001/api/cms/save',

        // HTTP request type.
        //saveMethod: 'POST',

        // Additional save params.
        /*saveParams: {
            id: 'my_editor'
        },*/

        toolbarButtons: {
            moreText: {
                buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],
                buttonsVisible: 3
            },
            moreParagraph: {
                buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'outdent', 'indent', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'quote'],
                buttonsVisible: 6
            },
            moreRich: {
                buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR', 'embedUrl', 'fontAwesome'],
                buttonsVisible: 4
            },
            moreMisc: {
                buttons: ['undo', 'redo', 'fullscreen', 'print', 'selectAll', 'html', 'help', 'save'],
                align: 'right',
                buttonsVisible: 2
            }
        },
        events: {
            "image.beforeUpload": function(files) {
                const editor = this;
                if (files.length) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const result = e.target.result;
                        editor.image.insert(result, null, null, editor.image.get());
                    };
                    reader.readAsDataURL(files[0]);
                }
                editor.popups.hideAll();
                return false;
            }
        }
    };

    return(
        <div className={'text-editor field input-text-component'}>
            <div className="control">
                <FroalaEditor
                    config={config}
                    model={value}
                    onModelChange={handleChange}
                    tag='textarea' />
            </div>
        </div>
    );
};