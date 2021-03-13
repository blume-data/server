import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import './asset-adder.scss';
import {RenderHeading} from "../../RenderHeading";
import UploadAsset from '../../../common/UploadAsset';
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {CLIENT_USER_NAME, MULTIPLE_ASSETS_TYPE, SINGLE_ASSETS_TYPE} from "@ranjodhbirkaur/constants";
import {getBaseUrl} from "../../../../utils/urls";
import {Avatar, Chip} from "@material-ui/core";
import Loader from "../../Loader";

type PropsFromRedux = ConnectedProps<typeof connector>;
type AssetsAdderType = PropsFromRedux & {
    className: string;
    value: string;
    onChange: (event: any) => void;
    onBlur: (event: any) => void;
    descriptionText: string;
    label: string;
    assetType?: string;
    // init assets data while editing assets type
    assetInit?: FileUploadType[];
}

export interface FileUploadType {
    id: string;
    tbU: string;
    name: string;
    type: string;
}

export const AssetsAdderComponent = (props: AssetsAdderType) => {

    const {className, value, onChange, descriptionText, onBlur, label, assetType, assetInit} = props;
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    const [filesIds, setFilesIds] = useState<FileUploadType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const url = props.assetsUrls ? props.assetsUrls.authAssets : '';
    const authUrl = `${getBaseUrl()}${url}`;

    /*If value changes from back update the ids*/
    useEffect(() => {
        if(value && !isLoading && typeof value === 'string') {
            const joinedValue = value.split(',');
            const newIds: FileUploadType[] = [];
            if(joinedValue && joinedValue.length) {
                joinedValue.forEach(item => {
                    const exist = filesIds.find(id => id.id === item);
                    if(exist) {
                        newIds.push(exist);
                    }
                });
                setFilesIds(newIds);
            }
        }
    }, [value]);

    function updateValue(ids: FileUploadType[]) {
        if(ids && ids.length) {
            const event = {
                target: {
                    value: ids.map(id => id.id).join(',')
                }
            }
            onBlur(event);
            setTimeout(() => {
                onChange(event);
            }, 100);
        }
    }

    /*Remove reference*/
    function removeReference(id: string) {
        const filtered = filesIds.filter(item => item.id !== id);
        setFilesIds(filtered);
        setTimeout(() => {
            updateValue(filtered);
        });
    }

    // when file ids change update value
    useEffect(() => {
        updateValue(filesIds);
    }, [filesIds]);

    // set fileIds when initAsset is there
    useEffect(() => {
        if(assetInit) {
            setFilesIds(assetInit);
        }
    }, [assetInit]);

    return (
        <Grid className={`${className} assets-adder-editor-wrapper`}>
            <RenderHeading value={label} type={"primary"} />
            <RenderHeading value={descriptionText} type={"secondary"} />
            <Grid container justify={"flex-end"}>
                {
                    assetType === MULTIPLE_ASSETS_TYPE || ((filesIds.length < 1) && (assetType === SINGLE_ASSETS_TYPE))
                    ? <UploadAsset
                            setLoading={setIsLoading}
                            setUploadedFiles={setFilesIds}
                            uFiles={filesIds}
                            // verify url
                            v_3_5_6={props.assetsUrls && props.assetsUrls.v_3_5_6}
                            // temporary url
                            t_s_4_6_3_t={props.assetsUrls && props.assetsUrls.t_s_4_6_3_t}
                            authUrl={authUrl.replace(`:${CLIENT_USER_NAME}`, clientUserName || '')}

                        />
                    : null
                }
            </Grid>
            {isLoading ? <Loader /> : null}
            <Grid container className={'files-component'} justify={"flex-start"}>
                {
                    filesIds.map((refId,index) => {
                        return (
                            <Chip
                                key={index}
                                onDelete={() => removeReference(refId.id)}
                                label={refId.name}
                                variant="outlined"
                                avatar={<Avatar
                                    alt={refId.name}
                                    src={refId.tbU}
                                />}
                            />
                        );
                    })
                }
            </Grid>
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        assetsUrls: state.routeAddress.routes.assets
    }
};

const connector = connect(mapState);
export default connector(AssetsAdderComponent);