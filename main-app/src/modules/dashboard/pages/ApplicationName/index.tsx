import React, {useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import {useParams} from "react-router";
import './application-name.scss';
import {setApplicationName} from "../../../authentication/pages/Auth/actions";
import DataModels from "./DataModels";
import {AccordianCommon} from "../../../../components/common/AccordianCommon";

type PropsFromRedux = ConnectedProps<typeof connector>;
const ApplicationName = (props: PropsFromRedux) => {

    const {env, language, setApplicationName} = props;

    const {applicationName} = useParams();

    useEffect(() => {
        setApplicationName(applicationName);
    },[applicationName, env, language]);

    return (

        <Grid className={'store-page-container'}>
            <Paper elevation={3}>
                <Grid className={'accordion-list'}>
                    <AccordianCommon name={'Data models'}>
                        <DataModels />
                    </AccordianCommon>
                </Grid>

            </Paper>
        </Grid>
    );
};

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language
    }
};

const connector = connect(mapState, {setApplicationName});
export default connector(ApplicationName);