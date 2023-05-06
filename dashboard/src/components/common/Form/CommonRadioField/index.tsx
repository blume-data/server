import React, { ChangeEvent } from "react";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { FieldType } from "../interface";
import { FormLabel } from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormHelperText from "@material-ui/core/FormHelperText";
import { DescriptionText } from "../DescriptionText";

interface RadioTypeProps extends FieldType {
  onChange: (event: ChangeEvent<any>) => void;
  onBlur: (event: ChangeEvent<any>) => void;
}

export const CommonRadioField = (props: RadioTypeProps) => {
  const {
    id,
    className,
    label,
    required,
    disabled = false,
    onBlur,
    helperText,
    name,
    options,
    descriptionText = "",
    onChange,
    error = false,
    value = "",
  } = props;
  return (
    <Grid className={`${className} app-radio-box`} id={id ? id : undefined}>
      <FormControl
        required={required}
        component="fieldset"
        error={error}
        disabled={disabled}
      >
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup
          aria-label={label}
          name={name}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
        >
          {options &&
            options.map((option) => {
              return (
                <FormControlLabel
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              );
            })}
        </RadioGroup>
        {error && helperText ? (
          <FormHelperText>{helperText}</FormHelperText>
        ) : null}
        <DescriptionText description={descriptionText} />
      </FormControl>
    </Grid>
  );
};
