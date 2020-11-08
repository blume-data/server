import React from "react";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {SIGN_IN, SIGN_UP} from "../index";

export const TopLink = (props: {step: string}) => {

    const {step} = props;

    return (
        <Typography>
            {step === SIGN_UP ? `Already` :`Don't`} have an account? <Link
            to={`/auth/${step === SIGN_UP ? SIGN_IN : SIGN_UP}`}>
            {step === SIGN_UP ? `Login` : `Register`}
        </Link>
        </Typography>
    );
};