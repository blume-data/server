import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {doGetRequest, doPostRequest} from "../../../../utils/baseApi";
import {getDataRoutes} from '../../../../utils/urls'

export const Home = () => {

    async function fetchDataRoutes() {
        const reponse = await doGetRequest(`${getDataRoutes()}`);
        console.log('resp', reponse);
    }

    // fetch the data routes
    useEffect(() => {
        fetchDataRoutes();
    })


    return (
        <Grid>
            Hello
        </Grid>
    );
};