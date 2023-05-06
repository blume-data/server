import React from "react";
import "./style.scss";

export default function Loader() {
  return (
    <div className={"spinner"}>
      <div className="spinner-background" />
      <div className={"spinner-container"}>
        <div className="spinner" />
      </div>
    </div>
  );
}
