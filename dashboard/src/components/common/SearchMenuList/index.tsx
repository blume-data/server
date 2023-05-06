import React, { useEffect, useState } from "react";
// import { createStyles, makeStyles } from "@mui/styles";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { Grid, InputAdornment } from "@mui/material";
import "./style.scss";
import List from "@mui/material/List";
import InputLabel from "@mui/material/InputLabel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { randomString } from "../../../utils/tools";

// const useStyles = makeStyles(() =>
//   createStyles({
//     root: {
//       width: "100%",
//       maxHeight: 400
//     },
//   })
// );

interface OptionType {
  label: string;
  value: string;
}

interface SearchMenuListProps {
  options: OptionType[];
  value: string;
  onMenuChange: (value: string) => void;
  placeholder?: string;
  classNames?: string;
}

export const SearchMenuList = (props: SearchMenuListProps) => {
  const [search, setSearch] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [timeZones, setTimeZones] = useState<OptionType[]>([]);
  const [hide, setHide] = useState<boolean>(true);
  const [offSetWidth, setOffSetWidth] = useState<number>(200);
  // const classes = useStyles();

  const randomId = randomString();

  const {
    options,
    value,
    onMenuChange,
    placeholder = "Search",
    classNames = "",
  } = props;

  useEffect(() => {
    setSelectedValue(value);
    setSearch(value);
    const ti: any = document.getElementsByClassName(
      `input-field-${placeholder}`
    );
    if (ti && ti[0] && ti[0].offsetWidth) {
      setOffSetWidth(ti[0].offsetWidth - 3);
    }
  }, [value, placeholder]);

  useEffect(() => {
    setTimeZones(options);
  }, [options]);

  useEffect(() => {
    if (search) {
      const filteredTimeZones = options.filter((timeZone) => {
        return timeZone.value.toLowerCase().includes(search.toLowerCase());
      });
      setTimeZones(filteredTimeZones);
    } else {
      setTimeZones(options);
    }
  }, [search]);

  function onChange(e: any) {
    setSearch(e.target.value);
  }

  function renderRow(timeZone: OptionType, index: number) {
    function onClick() {
      setSelectedValue(timeZone.value);
      setSearch(timeZone.value);
      setHide(true);
      setTimeout(() => {
        onMenuChange(timeZone.value);
      });
    }

    return (
      <ListItem
        button
        selected={timeZone.value === selectedValue}
        key={index}
        onClick={onClick}
      >
        <ListItemText primary={`${timeZone.value}`} />
      </ListItem>
    );
  }

  function onBlurTextSearch() {
    setTimeout(() => setHide(true), 500);
  }

  // focus on input
  function focusOnInputOnIconClick() {
    const ti: any = document.getElementById(
      `input-field-${placeholder}-${randomId}`
    );
    if (ti && ti.focus) {
      ti.focus();
    }
  }

  return (
    <Grid
      id={`search-input-text-box-container-${placeholder}`}
      className={`${classNames} search-menu-list`}
    >
      <InputLabel>{placeholder}</InputLabel>
      <TextField
        autoComplete="off"
        variant="outlined"
        id={`input-field-${placeholder}-${randomId}`}
        onFocus={() => setHide(false)}
        onBlur={onBlurTextSearch}
        value={hide ? selectedValue : search}
        placeholder={placeholder}
        InputProps={{
          endAdornment: (
            <InputAdornment onClick={focusOnInputOnIconClick} position="end">
              <ArrowDropDownIcon />
            </InputAdornment>
          ),
        }}
        className={`input-field-${placeholder}`}
        onChange={onChange}
      />
      <div
        className={`list`}
        style={{ display: `${hide ? "none" : "block"}` }}
      >
        <List className={"fixed-size-list"} style={{ width: offSetWidth }}>
          {timeZones.map(renderRow)}
        </List>
      </div>
    </Grid>
  );
};
