import React, {ChangeEvent} from "react";
import {FormLabel, Grid} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {FieldType} from "../interface";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import './style.scss';
import {DescriptionText} from "../DescriptionText";

interface CheckBoxTypeProps extends FieldType{
    onChange: (event: ChangeEvent<any>) => void;
    onBlur: (event: ChangeEvent<any>) => void;
}

export const CommonCheckBoxField = (props: CheckBoxTypeProps) => {

    const {id, className, label,
        onBlur, helperText, name, disabled=false,
        onChange, error=false, value='', descriptionText=''
    } = props;

    function onChangeCheckBox(e: ChangeEvent<any>) {
        e.target.value = e.target.checked;
        onChange(e);
    }

    return (
        <Grid className={`${className} app-check-box-field`} id={id ? id : undefined}>
            <FormControl component="fieldset" disabled={disabled} error={error} className={'form-control'}>
                <FormLabel component="legend">{label}</FormLabel>
                <FormGroup onBlur={onBlur}>
                    <FormControlLabel
                        control={<Checkbox checked={value === 'true'} value={!!value} onChange={onChangeCheckBox} name={name} />}
                        label={label}
                    />
                </FormGroup>
                <FormHelperText>{helperText}</FormHelperText>
                <DescriptionText description={descriptionText} />
            </FormControl>
        </Grid>
    );
}