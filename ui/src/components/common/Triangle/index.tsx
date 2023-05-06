import React from "react";
import "./picture.scss";

export const Triangle = (props: { className?: string }) => {
  return (
    <div className={`${props.className ? props.className : ""} up-triangle`} />
  );
};
