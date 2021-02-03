import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {connect, ConnectedProps} from "react-redux";
import './reference-editor.scss';
import {RootState} from "../../../../rootReducer";
import CreateEntry from "../../../../modules/dashboard/pages/DateEntries/CreateEntry";
import {Chip} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {CommonButton} from "../../CommonButton";
import {ONE_TO_ONE_RELATION} from "@ranjodhbirkaur/constants";
import ModalDialog from "../../ModalDialog";

type PropsFromRedux = ConnectedProps<typeof connector>;
type ReferenceEditorType = PropsFromRedux & {
    REFERENCE_MODEL_TYPE: string;
    REFERENCE_MODEL_NAME: string;
    className: string;
    value: string;
    onChange: (event: any) => void;
    onBlur: (event: any) => void;
    descriptionText: string;
    label: string;
}
export const ReferenceEditor = (props: ReferenceEditorType) => {

    const {REFERENCE_MODEL_NAME, REFERENCE_MODEL_TYPE, className, value, onChange, descriptionText, onBlur, label} = props;
    const [refIds, setRefIds] = useState<string[]>([]);
    const [showCreateButton, setShowCreateButton] = useState<boolean>(true);

    useEffect(() => {
        // value is csv
        if(value && value.length) {
            const split = value.split(',');
            if(split && split.length) {
                setRefIds(split);
            }
        }
        else {
            setRefIds([]);
        }
    }, [value]);

    function updateValue(refIds: string[]) {
        const event = {
            target: {
                value: refIds.join(',')
            }
        }
        onBlur(event);
        setTimeout(() => {
            onChange(event);
        }, 100);
    }

    function createRefEntryCallBack(id: string) {
        const newRefs = [...refIds, id];
        setRefIds(newRefs);
        setShowCreateButton(true);
        setTimeout(() => {
            updateValue(newRefs);
        });
    }

    function removeReference(id: string) {
        const filtered = refIds.filter(item => item !== id);
        setRefIds(filtered);
        setTimeout(() => {
            updateValue(filtered);
        });
    }

    return (
        <Grid className={`${className} reference-editor-wrapper`}>
            <Typography component={'p'}>
                {label}
            </Typography>
            <Typography component={'p'}>
                Reference model: <strong>{`${REFERENCE_MODEL_NAME}`}</strong>
            </Typography>
            {
                descriptionText
                ? <Typography component={'p'}>{descriptionText}</Typography>
                : null
            }
            {
                refIds && refIds.length
                ? <Grid className="reference-ids-list-wrapper">
                    <Typography component={'p'} className={'reference-list-name'}>
                        {`${REFERENCE_MODEL_NAME} reference list`}
                    </Typography>
                    <Grid className={'reference-ids-list-wrapper'}>
                        {refIds.map((data, index) => {
                            return (
                                <Chip
                                    className={'chip'}
                                    key={index}
                                    title={'delete reference'}
                                    label={data}
                                    onDelete={() => removeReference(data)}
                                />
                            );
                        })}
                    </Grid>
                  </Grid>
                : null
            }
            {
                showCreateButton && !(refIds.length && REFERENCE_MODEL_TYPE === ONE_TO_ONE_RELATION)
                ? <Grid className="create-model-wrapper">
                        <CommonButton
                            name={`Add ${REFERENCE_MODEL_NAME}`}
                            onClick={() => setShowCreateButton(false)}
                        />
                  </Grid>
                : null
            }
            <ModalDialog
                className={'reference-editor-modal-container'}
                isOpen={!showCreateButton}
                handleClose={() => setShowCreateButton(true)}
                title={`Create ${REFERENCE_MODEL_NAME}`}
            >
                <CreateEntry modelNameProp={REFERENCE_MODEL_NAME} createEntryCallBack={createRefEntryCallBack} />
            </ModalDialog>
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
export default connector(ReferenceEditor);