import React from "react";
import {Grid} from "@material-ui/core";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {useParams} from "react-router";
import {dashboardCreateDataEntryUrl} from "../../../../utils/urls";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import loadable from "@loadable/component";
import './data-entries.scss';

const EntriesTable = loadable(() => import('./EntriesTable'), {
    resolveComponent: component => component.EntriesTable,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

function dataEntriesComponent(props: PropsFromRedux) {
    const {applicationName} = props;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {modelName} = useParams();

    const createDataEntryUrl = dashboardCreateDataEntryUrl
        .replace(':applicationName', applicationName)
        .replace(':modelName', modelName);

    return (
        <Grid className={'data-entries-wrapper-container'}>
            <Grid className="data-entries">
                <Grid container justify={"space-between"}>

                    <Grid item>
                        <Link to={createDataEntryUrl}>
                            <Button variant={"contained"} color={"primary"}>
                                Add {`${modelName ? modelName : 'entry'}`}
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
                <EntriesTable
                    modelName={modelName}
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