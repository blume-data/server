import { ChangeEvent } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import "./style.scss";
import { FieldType, OptionsType } from "../interface";
import { DescriptionText } from "../DescriptionText";

interface DropDownType extends FieldType {
  options: OptionsType[];
  index: number;
  onChange: (event: ChangeEvent<any>) => void;
  onBlur?: (event: ChangeEvent<any>) => void;
  multiple?: boolean;
  value: any;
}
export const DropDown = (props: DropDownType) => {
  const {
    options,
    id,
    className,
    name,
    onChange,
    onBlur,
    label,
    multiple = false,
    error = false,
    helperText,
    disabled = false,
    descriptionText = "",
    placeholder = "",
    required = false,
    value,
    index,
  } = props;
  const randomId = `${name
    .split(" ")
    .join("-")}-${index}-drop-down-input-label`;

  return (
    <Grid
      key={index}
      className={`${className} app-drop-down`}
      id={id ? id : ""}
    >
      <FormControl
        className={"app-drop-down-form-control"}
        error={error}
        disabled={disabled}
      >
        <InputLabel id={randomId}>{label}</InputLabel>
        <Select
          className={"app-drop-down-select"}
          name={name}
          onBlur={onBlur}
          placeholder={placeholder}
          labelId={randomId}
          value={value}
          required={required}
          onChange={onChange}
          multiple={multiple}
        >
          {multiple ? null : (
            <MenuItem className={"app-drop-down-menu-item"} value="">
              None
            </MenuItem>
          )}
          {options &&
            options.map((option, index) => (
              <MenuItem
                key={index}
                className={"app-drop-down-menu-item"}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
        </Select>
        {error && helperText ? (
          <FormHelperText>{helperText}</FormHelperText>
        ) : null}
        <DescriptionText description={descriptionText} />
      </FormControl>
    </Grid>
  );
};
