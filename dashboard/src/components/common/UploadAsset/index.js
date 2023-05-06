import React from "react";
import ImageKit from "imagekit-javascript";
import { getItemFromLocalStorage, randomString } from "../../../utils/tools";
import { CLIENT_USER_NAME } from "@ranjodhbirkaur/constants";
import { Button } from "../Button";
import "./upload-assets.scss";
import { doPostRequest } from "../../../utils/baseApi";
import { getBaseUrl } from "../../../utils/urls";

export default (props) => {
  const publicKey = "public_k1JAmfGkYnDN/dhR+aVH6EpD9WM=";
  const urlEndpoint = "https://ik.imagekit.io/kafwriey64l/";
  const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

  const { createTempRecord, verifyTempRecord } = props;
  // to get asset ids
  const { setLoading = null, setUploadedFiles = null, uFiles } = props;

  const imagekit = new ImageKit({
    publicKey,
    urlEndpoint,
    authenticationEndpoint: props.authUrl ? props.authUrl : "",
  });

  const componentId = randomString(10);

  function clickOnUploadInput() {
    document.getElementById(componentId).click();
  }

  async function uploadImages(e) {
    const files = e.target.files;
    let localFiles;
    const promises = [];
    if (uFiles) {
      localFiles = JSON.parse(JSON.stringify(uFiles));
    }
    if (setLoading) {
      setLoading(true);
    }
    if (files && files.length) {
      for (const file of files) {
        promises.push(
          new Promise(async (resolve) => {
            const r945 = createTempRecord.replace(
              `:${CLIENT_USER_NAME}`,
              clientUserName
            );
            const r43 = verifyTempRecord.replace(
              `:${CLIENT_USER_NAME}`,
              clientUserName
            );
            // get temporary url
            const t_0 = await doPostRequest(
              `${getBaseUrl()}${r945}`,
              {
                fileName: file.name,
              },
              true
            );
            await imagekit.upload(
              {
                file,
                fileName: file.name,
                tags: [clientUserName],
                isPrivateFile: true,
              },
              async function (err, result) {
                // verify the photos
                await doPostRequest(`${getBaseUrl()}${r43}`, {
                  di_98: t_0,
                  emanelif_89: result.name,
                  htap_21: result.filePath,
                  tu: result.thumbnailUrl,
                  h: result.height,
                  w: result.width,
                  s: result.size,
                  ty: file.type,
                  dilife: result.fileId,
                });
                const fileType = result.name.split(".").pop();
                if (setUploadedFiles) {
                  localFiles.push({
                    name: result.filePath,
                    tbU: result.thumbnailUrl,
                    id: t_0,
                    type: fileType,
                  });
                  setUploadedFiles(localFiles);
                }
                resolve(true);
              }
            );
          })
        );
      }
      Promise.all(promises).then(() => {
        if (setLoading) {
          setLoading(false);
        }
      });
    }
  }

  async function upload(e) {
    await uploadImages(e);
  }

  if (props.authUrl) {
    return (
      <div className="upload-assets-container">
        <input
          id={componentId}
          className={"hidden-input"}
          onChange={upload}
          type="file"
          multiple
        />
        <Button
          onClick={clickOnUploadInput}
          name={"Add Assets"}
          title={"Add Assets"}
        />
      </div>
    );
  }
  return null;
};
