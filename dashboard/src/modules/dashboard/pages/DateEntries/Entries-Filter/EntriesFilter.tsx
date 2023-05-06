import React, { useContext, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { RootState } from "../../../../../rootReducer";
import { connect, ConnectedProps } from "react-redux";
import { getModelDataAndRules } from "../../../../../utils/tools";
import {
  DATE_FIElD_TYPE,
  DESCRIPTION,
  DISPLAY_NAME,
  INTEGER_FIElD_TYPE,
  NAME,
  RuleType,
  SHORT_STRING_FIElD_TYPE,
} from "@ranjodhbirkaur/constants";
import "./entries-filter.scss";
import { SearchMenuList } from "../../../../../components/common/SearchMenuList";
import { Button } from "../../../../../components/common/Button";
import { TextField, Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
// import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
interface ModelsType {
  [DESCRIPTION]: string;
  [NAME]: string;
  [DISPLAY_NAME]: string;
  _id: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type EntriesFilterComponentType = PropsFromRedux & {
  modelName: string;
  setModelName?: (name: string) => void;
  rules: RuleType[] | null;
  onChangeWhere: (o: object) => void;
  onChangeMatch: (o: object) => void;
  // if selectable don't show the dropdown to change the model
  disableModelChange?: boolean;
};

interface FilterType {
  propertyName: string;
  filterValue: string;
  inputType: string;
}

export const EntriesFilterComponent = (props: EntriesFilterComponentType) => {
  const {
    applicationName,
    env,
    language,
    GetCollectionNamesUrl,
    modelName,
    setModelName,
    disableModelChange = false,
    onChangeWhere,
    onChangeMatch,
  } = props;
  const [models, setModels] = useState<ModelsType[]>([]);
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [rules, setRules] = useState<RuleType[]>([]);

  async function fetchModelRulesAndData(
    fetchModels = false,
    getOnly = `${DESCRIPTION},${NAME},${DISPLAY_NAME}`
  ) {
    if (GetCollectionNamesUrl && applicationName) {
      const response = await getModelDataAndRules({
        applicationName,
        language,
        modelName: fetchModels ? modelName : "",
        env,
        GetCollectionNamesUrl,
        getOnly,
      });
      if (response && response.length) {
        setModels(response);
        if (!modelName) {
          onChangeModelDropDown(response[0].name);
        }
      }
    }
  }

  // Fetch Model Data and Rules
  useEffect(() => {
    fetchModelRulesAndData();
  }, [GetCollectionNamesUrl, applicationName]);

  // Set rules
  useEffect(() => {
    if (props.rules) {
      setRules(props.rules);
    }
  }, [props.rules]);

  /*On blur property name update the value in where*/
  function onBlurPropertyInput(e: any) {
    if (e) {
      if (e.key === "Enter") {
        changeMatchAndWhere(filters);
      }
    } else {
      changeMatchAndWhere(filters);
    }
  }

  const modelOptions = models.map((model) => {
    return {
      label: model[DISPLAY_NAME],
      value: model[NAME],
    };
  });

  const rulesOptions =
    rules &&
    rules.map((rule) => {
      return {
        label: rule[DISPLAY_NAME],
        value: rule[NAME],
      };
    });

  // on change dropdown
  function onChangeModelDropDown(value: string) {
    if (setModelName) {
      setModelName(value);
      setFilters([]);
    }
  }
  // on change properties dropdown
  function onChangePropertiesDropdown(value: string, index: number) {
    const exist = rules && rules.find((rule) => rule.name === value);
    if (exist) {
      const newFilters = filters.map((f, i) => {
        if (i === index) {
          return {
            propertyName: value,
            filterValue: "",
            inputType: exist.type,
          };
        }
        return f;
      });
      const newRules: RuleType[] = [];
      props.rules &&
        props.rules.forEach((f) => {
          const exist = newFilters.find((r) => r.propertyName === f.name);
          if (!exist) {
            newRules.push(f);
          }
        });
      setRules(newRules);
      setFilters(newFilters);
    }
  }

  // remove property from dropdown
  function removePropertyDropDown(index: number) {
    const newFilters = filters.filter((f, i) => i !== index);

    const newRules: RuleType[] = [];

    props.rules &&
      props.rules.forEach((f) => {
        const exist = newFilters.find((r) => r.propertyName === f.name);
        if (!exist) {
          newRules.push(f);
        }
      });
    setRules(newRules);
    setFilters(newFilters);
    changeMatchAndWhere(newFilters);
  }

  function renderFilters() {
    return (
      rulesOptions &&
      filters.map((filter, index) => {
        return (
          <Grid
            key={index}
            container
            justify={"flex-start"}
            className="filter-wrapper"
          >
            <Grid item className={"property-list"}>
              <SearchMenuList
                value={filter.propertyName}
                classNames={"property-dropdown"}
                placeholder={"Model properties"}
                options={rulesOptions}
                onMenuChange={(v) => onChangePropertiesDropdown(v, index)}
              />
            </Grid>
            <Grid item className={"input-field-wrapper"}>
              {renderPropertyInputField(filter)}
            </Grid>
            <Grid item className={"close-button"}>
              <Tooltip title={"Delete filter"}>
                <IconButton>
                  <CloseIcon onClick={() => removePropertyDropDown(index)} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        );
      })
    );
  }

  function renderPropertyInputField(filter: FilterType) {
    const { propertyName, inputType, filterValue } = filter;

    function onChange(e: any) {
      const value = e.target.value;
      const newFilters = filters.map((f) => {
        if (f.propertyName === propertyName) {
          return {
            propertyName: propertyName,
            filterValue: value,
            inputType,
          };
        }
        return f;
      });
      setFilters(newFilters);
    }
    const name = "Filter Value";

    if (propertyName) {
      const placeholder = "Type to search for entries";

      switch (inputType) {
        case INTEGER_FIElD_TYPE: {
          return (
            <TextField
              value={filterValue}
              name={name}
              variant="outlined"
              type={"number"}
              placeholder={placeholder}
              className="filter-text-input"
              onChange={onChange}
              onKeyDown={onBlurPropertyInput}
              onBlur={onBlurPropertyInput}
            />
          );
        }
        case DATE_FIElD_TYPE: {
          return null;
          // return <MuiPickersUtilsProvider utils={DateFnsUtils}>
          //             <KeyboardDatePicker
          //                 margin="normal"
          //                 id={`date-picker-dialog-${name}`}
          //                 label="Date"
          //                 format="MM/dd/yyyy"
          //                 value={filterValue ? filterValue : null}
          //                 onChange={(value) => onChange({target: {value}})}
          //                 KeyboardButtonProps={{
          //                     'aria-label': 'change date',
          //                 }}
          //             />
          //         </MuiPickersUtilsProvider>
        }
        default: {
          return (
            <TextField
              value={filterValue}
              name={name}
              variant="outlined"
              type={"text"}
              className="filter-text-input"
              placeholder={placeholder}
              onChange={onChange}
              onKeyDown={onBlurPropertyInput}
              onBlur={onBlurPropertyInput}
            />
          );
        }
      }
    }
    return null;
  }

  function onClickAddFilter() {
    if (!rules.length) return;
    let hasEmptyFilter = false;
    filters.forEach((f) => {
      if (!f.propertyName) {
        hasEmptyFilter = true;
      }
    });
    if (!hasEmptyFilter) {
      setFilters([
        ...filters,
        { propertyName: "", filterValue: "", inputType: "text" },
      ]);
    }
  }

  /*
   * Change match and where
   * */
  function changeMatchAndWhere(newFilters: FilterType[]) {
    let where: any = {};
    let match: any = {};

    newFilters.forEach((newFilter) => {
      if (newFilter.inputType === SHORT_STRING_FIElD_TYPE) {
        match[newFilter.propertyName] = newFilter.filterValue;
      } else {
        where[newFilter.propertyName] = newFilter.filterValue;
      }
    });

    onChangeMatch(match);
    onChangeWhere(where);
  }

  return (
    <Grid className={"entries-filter-wrapper-container"}>
      {/*Selectable hide the dropdown with models*/}
      {disableModelChange ? null : (
        <Grid className="filters-wrapper">
          <Grid className="model-dropdown-wrapper">
            <SearchMenuList
              value={modelName}
              placeholder={"Filter model"}
              options={modelOptions}
              onMenuChange={onChangeModelDropDown}
            />
          </Grid>
        </Grid>
      )}
      <Grid className="property-dropdown-wrapper">
        {modelName ? (
          <Grid container justify={"flex-start"} className="wrapper">
            {/*Render Property input value*/}
            {renderFilters()}
          </Grid>
        ) : null}
      </Grid>
      <Grid className={"add-filters-button-wrapper"}>
        <Button
          variant="text"
          name={"Add filter"}
          onClick={onClickAddFilter}
        />
      </Grid>
    </Grid>
  );
};

const mapState = (state: RootState) => {
  return {
    applicationName: state.authentication.applicationName,
    env: state.authentication.env,
    language: state.authentication.language,
    GetCollectionNamesUrl:
      state.routeAddress.routes.data?.GetCollectionNamesUrl,
  };
};

const connector = connect(mapState);
export const EntriesFilter = connector(EntriesFilterComponent);
