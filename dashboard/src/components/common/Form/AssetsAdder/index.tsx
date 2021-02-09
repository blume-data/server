import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import './asset-adder.scss';
import {RenderHeading} from "../../RenderHeading";
import UploadAsset from '../../../common/UploadAsset';
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {getBaseUrl} from "../../../../utils/urls";

type PropsFromRedux = ConnectedProps<typeof connector>;
type AssetsAdderType = PropsFromRedux & {
    className: string;
    value: string;
    onChange: (event: any) => void;
    onBlur: (event: any) => void;
    descriptionText: string;
    label: string;
}

export const AssetsAdderComponent = (props: AssetsAdderType) => {

    const {className, value, onChange, descriptionText, onBlur, label} = props;
    const [refIds, setRefIds] = useState<string[]>([]);
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    const url = props.assetsUrls ? props.assetsUrls.authAssets : '';
    const authUrl = `${getBaseUrl()}${url}`;

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


    return (
        <Grid className={`${className} assets-adder-editor-wrapper`}>
            <RenderHeading title={label} value={label} type={"primary"} />
            <Grid container justify={"flex-end"}>
                <UploadAsset
                    // verify url
                    v_3_5_6={props.assetsUrls && props.assetsUrls.v_3_5_6}
                    // temporary url
                    t_s_4_6_3_t={props.assetsUrls && props.assetsUrls.t_s_4_6_3_t}
                    authUrl={authUrl.replace(`:${CLIENT_USER_NAME}`, clientUserName || '')}

                />
            </Grid>
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        /*GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
        StoreUrl: state.routeAddress.routes.data?.StoreUrl,*/
        assetsUrls: state.routeAddress.routes.assets
    }
};

const connector = connect(mapState);
export default connector(AssetsAdderComponent);