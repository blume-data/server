import React from "react";
import { HeadingTypeInterface } from "../RenderHeading";
import "./style.scss";

export const Button = (props: {
  name?: string;
  onClick?: () => void;
  color?: "primary" | "secondary";
  variant?: "contained" | "text" | "outlined" | undefined;
  title?: string;
  type?: HeadingTypeInterface;
  className?: string;
  startIcon?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  tabIndex?: number;
}) => {
  const {
    onClick = null,
    className = "",
    children,
    name = ''
  } = props;

  function onButtonClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <button className={`rounded-full ${className}`} onClick={onButtonClick}>{children}</button>
  );
};
