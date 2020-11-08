import React from "react";
import {Grid} from "@material-ui/core";
import './style.scss';

export const DescriptionText = (props: {description: string}) => {
    return (
        <Grid className={'form-description-text'}>
            <p>{props.description}</p>
        </Grid>
    );
}