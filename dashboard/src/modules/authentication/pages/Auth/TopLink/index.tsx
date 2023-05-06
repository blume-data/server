import React from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { SIGN_IN, SIGN_UP } from "../index";
import { authUrl } from "../../../../../utils/urls";

export const TopLink = (props: { step: string }) => {
  const { step } = props;

  return (
    <Typography className="center p-10">
      {step === SIGN_UP ? `Already` : `Don't`} have an account?{" "}
      <Link to={`${authUrl}/${step === SIGN_UP ? SIGN_IN : SIGN_UP}`}>
        {step === SIGN_UP ? `Login` : `Register`}
      </Link>
    </Typography>
  );
};
