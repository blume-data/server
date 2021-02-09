import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {useHistory, useParams} from "react-router";
import {dashboardCreateDataEntryUrl, dashboardDataEntriesUrl} from "../../../../utils/urls";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import './data-entries.scss';
import {EntriesTable} from "../../../../components/common/EntriesTable";

type PropsFromRedux = ConnectedProps<typeof connector>;

function dataEntriesComponent(props: PropsFromRedux) {
    const {applicationName} = props;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedModelName, setSelectedModelName] = useState<string>('');

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {modelName} = useParams<{modelName: string}>();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const history = useHistory();

    const createDataEntryUrl = dashboardCreateDataEntryUrl
        .replace(':applicationName', applicationName)
        .replace(':modelName', modelName);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // Redirect to correct route
        if(selectedModelName) {
            const url = dashboardDataEntriesUrl
                .replace(':applicationName', applicationName)
                .replace(':modelName', selectedModelName);
            history.push(url);
        }
    }, [selectedModelName]);

    return (
        <Grid className={'data-entries-wrapper-container'}>
            <Grid className="data-entries">
                {
                    modelName
                    ? <Grid container justify={"space-between"}>
                            <Grid item>
                                <Link to={createDataEntryUrl}>
                                    <Button variant={"contained"} color={"primary"}>
                                        Add {`${modelName ? modelName : 'entry'}`}
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    : null
                }
                <EntriesTable
                    modelName={modelName}
                    setModelName={setSelectedModelName}
                />

            </Grid>
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        applicationName: state.authentication.applicationName,
    }
};

const connector = connect(mapState);
export const DataEntries = connector(dataEntriesComponent);