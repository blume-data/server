import React from "react";
import { Avatar } from "@material-ui/core";
import { isExternalLink } from "../../../utils/tools";
import { Link } from "react-router-dom";

interface AvatarCommonType {
  alt: string;
  src: string;
  linkUrl?: string;
  target?: "_blank" | "";
}
const AC = (props: AvatarCommonType) => {
  const { alt, src } = props;
  return <Avatar alt={alt} src={src} />;
};

export const AvatarCommon = (props: AvatarCommonType) => {
  const { alt, src, linkUrl, target } = props;
  if (linkUrl && isExternalLink(linkUrl)) {
    return (
      <a href={linkUrl} target={target}>
        <AC alt={alt} src={src} />
      </a>
    );
  } else if (linkUrl) {
    return (
      <Link to={linkUrl} target={target}>
        <AC alt={alt} src={src} />
      </Link>
    );
  } else return <AC alt={alt} src={src} />;
};
