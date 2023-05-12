import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { connect, ConnectedProps } from "react-redux";
import "./reference-editor.scss";
import { RootState } from "../../../../rootReducer";
import CreateEntry from "../../../../modules/dashboard/pages/DateEntries/CreateEntry";
import { Chip, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Button } from "../../Button";
import {
  APPLICATION_NAME,
  ONE_TO_ONE_RELATION,
} from "@ranjodhbirkaur/constants";
import ModalDialog from "../../ModalDialog";
import { EntriesTable } from "../../EntriesTable";
import { RenderHeading } from "../../RenderHeading";
import { Link, useHistory } from "react-router-dom";
import { dashboardCreateDataEntryUrl } from "../../../../utils/urls";

type PropsFromRedux = ConnectedProps<typeof connector>;
type ReferenceEditorType = PropsFromRedux & {
  REFERENCE_MODEL_TYPE: string;
  REFERENCE_MODEL_NAME: string;
  className: string;
  value: string;
  onChange: (event: any) => void;
  onBlur: (event: any) => void;
  descriptionText: string;
  label: string;
};
export const ReferenceEditor = (props: ReferenceEditorType) => {
  const {
    REFERENCE_MODEL_NAME,
    REFERENCE_MODEL_TYPE,
    className,
    value,
    onChange,
    descriptionText,
    onBlur,
    label,
  } = props;
  const [refIds, setRefIds] = useState<string[]>([]);
  const [showCreateButton, setShowCreateButton] = useState<boolean>(true);
  const [isEntryFormOpen, setIsEntryFormOpen] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    // value is csv
    if (value && value.length) {
      const split = value.split(",");
      if (split && split.length) {
        setRefIds(split);
      }
    } else {
      setRefIds([]);
    }
  }, [value]);

  function updateValue(refIds: string[]) {
    const event = {
      target: {
        value: refIds.join(","),
      },
    };
    onBlur(event);
    setTimeout(() => {
      onChange(event);
    }, 100);
  }

  function createRefEntryCallBack(id: string) {
    const newRefs = [...refIds, id];
    setRefIds(newRefs);
    setShowCreateButton(true);
    setTimeout(() => {
      updateValue(newRefs);
    });
  }

  function removeReference(id: string) {
    const filtered = refIds.filter((item) => item !== id);
    setRefIds(filtered);
    setTimeout(() => {
      updateValue(filtered);
    });
  }

  const { applicationName } = props;

  return (
    <Grid className={`${className} reference-editor-wrapper`}>
      <RenderHeading value={label} type={"primary"} />
      <RenderHeading
        value={`Reference model: ${REFERENCE_MODEL_NAME}`}
        type={"secondary"}
      />
      {descriptionText ? (
        <RenderHeading value={descriptionText} type={"para"} />
      ) : null}
      {refIds && refIds.length ? (
        <Grid className="reference-ids-list-wrapper">
          <Typography component={"p"} className={"reference-list-name"}>
            {`${REFERENCE_MODEL_NAME} reference list`}
          </Typography>
          <Grid className={"reference-ids-list-wrapper"}>
            {refIds.map((data, index) => {
              const redirectUrl = dashboardCreateDataEntryUrl
                .replace(":id?", data)
                .replace(`:${APPLICATION_NAME}`, applicationName)
                .replace(`:modelName`, REFERENCE_MODEL_NAME);
              function onClickChip(e: any) {
                e.stopPropagation();
                e.preventDefault();
              }
              return (
                <Tooltip key={index} title={"Reference"}>
                  <Link className="ref-link" target="_blank" to={redirectUrl}>
                    <Chip
                      className={"chip"}
                      label={data}
                      onDelete={(e: any) => {
                        onClickChip(e);
                        removeReference(data);
                      }}
                    />
                  </Link>
                </Tooltip>
              );
            })}
          </Grid>
        </Grid>
      ) : null}
      {showCreateButton &&
      !(refIds.length && REFERENCE_MODEL_TYPE === ONE_TO_ONE_RELATION) ? (
        <Grid className="create-model-wrapper">
          <Button
            name={`Add ${REFERENCE_MODEL_NAME}`}
            onClick={() => setShowCreateButton(false)}
          />
          <Button
            title={`Select existing ${REFERENCE_MODEL_NAME}`}
            name={`Select ${REFERENCE_MODEL_NAME}`}
            onClick={() => setIsEntryFormOpen(true)}
          />
        </Grid>
      ) : null}
      <ModalDialog
        className={"reference-editor-modal-container"}
        isOpen={!showCreateButton}
        handleClose={() => setShowCreateButton(true)}
        title={`Create ${REFERENCE_MODEL_NAME}`}
      >
        <CreateEntry
          modelNameProp={REFERENCE_MODEL_NAME}
          createEntryCallBack={createRefEntryCallBack}
        />
      </ModalDialog>
      <ModalDialog
        isOpen={isEntryFormOpen}
        handleClose={() => setIsEntryFormOpen(false)}
        title={`Select ${REFERENCE_MODEL_NAME}`}
        className={"reference-editor-modal-container"}
      >
        <EntriesTable
          modelName={REFERENCE_MODEL_NAME}
          onEntrySelect={createRefEntryCallBack}
          selectable={true}
          initialSelectedEntries={refIds}
          onEntryDeSelect={removeReference}
        />
      </ModalDialog>
    </Grid>
  );
};

const mapState = (state: RootState) => {
  return {
    env: state.authentication.env,
    language: state.authentication.language,
    applicationName: state.authentication.applicationName,
    GetCollectionNamesUrl:
      state.routeAddress.routes.data?.GetCollectionNamesUrl,
    StoreUrl: state.routeAddress.routes.data?.StoreUrl,
  };
};

const connector = connect(mapState);
export default connector(ReferenceEditor);
