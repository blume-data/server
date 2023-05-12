import { ChangeEvent } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { FieldType } from "../interface";
import { FormLabel } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormHelperText from "@mui/material/FormHelperText";
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
