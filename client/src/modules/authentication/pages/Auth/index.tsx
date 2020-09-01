import React from "react";
import {Grid} from "@material-ui/core";
import {Form} from "../../../../components/common/Form";

export const Auth = () => {
    return (
        <Grid container direction={'row'} justify={'space-between'}>
            <Grid item>
                welcome

            </Grid>
            <Grid item>
                <Grid container justify={'center'}>
                    <Form className={'auth-form'} />
                </Grid>
            </Grid>

        </Grid>
    );
};