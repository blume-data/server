import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import './asset-adder.scss';
import {RenderHeading} from "../../RenderHeading";
import UploadAsset from '../../../common/UploadAsset';

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
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
        StoreUrl: state.routeAddress.routes.data?.StoreUrl,
        assetUrl: state.routeAddress.routes.assets?.authAssets
    }
};

const connector = connect(mapState);
export default connector(AssetsAdderComponent);