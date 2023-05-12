
import { ReactNode, CSSProperties } from 'react';
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
  startIcon?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
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
    <button className={`rounded-full bg-blue-600 py-2 px-4 text-white ${className}`} onClick={onButtonClick}>{name ? name : children}</button>
  );
};
