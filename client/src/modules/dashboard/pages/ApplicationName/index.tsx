import React, {useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import {useParams} from "react-router";
import './application-name.scss';
import {setApplicationName} from "../../../authentication/pages/Auth/actions";
import {StoreList} from "./StoreList";
import {AccordianCommon} from "../../../../components/common/AccordianCommon";

type PropsFromRedux = ConnectedProps<typeof connector>;
const ApplicationName = (props: PropsFromRedux) => {

    const {env, language, setApplicationName, GetCollectionNamesUrl} = props;

    const {applicationName} = useParams();

    useEffect(() => {
        setApplicationName(applicationName);
    },[props.GetCollectionNamesUrl, applicationName, env, language]);

    return (

        <Grid className={'store-page-container'}>
            <Paper elevation={3}>
                <Grid className={'accordion-list'}>
                    <AccordianCommon name={'stores'}>
                        <StoreList
                            env={env}
                            language={language}
                            GetCollectionNamesUrl={
                                GetCollectionNamesUrl
                                    ? GetCollectionNamesUrl
                                    : ''
                            }
                            applicationName={applicationName}
                        />
                    </AccordianCommon>
                </Grid>

            </Paper>
        </Grid>
    );
};

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl
    }
};

const connector = connect(mapState, {setApplicationName});
export default connector(ApplicationName);