import React from 'react';
import './index.scss'
import {Grid} from "@material-ui/core";
import {Footer} from "../Footer";
import {NavBar} from "../NavBar";

export interface PropsType {
    rootClass?: string;
    id?: string;
    children: JSX.Element;
}

export default (props: PropsType) => {
    const {children} = props;
    return (
        <Grid className="appLayout">
            <NavBar />
            {children}
            <Footer />
        </Grid>
    );
}