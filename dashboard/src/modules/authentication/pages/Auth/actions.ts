import { AnyAction } from "redux";
import {
  ACTION_AUTHENTICATE,
  ACTION_SET_APPLICATION_NAME,
  ACTION_SET_ENV,
  ACTION_SET_LANGUAGE,
  AppThunk,
} from "./types";
import { ThunkDispatch } from "redux-thunk";
import { EnglishLanguage, PRODUCTION_ENV } from "@ranjodhbirkaur/constants";
import { getItemFromLocalStorage } from "../../../../utils/tools";
import {
  LOCAL_STORAGE_ENV,
  LOCAL_STORAGE_SELECTED_APPLICATION_NAME,
} from "../../../../utils/constants";

export const setAuthentication =
  (status: boolean): AppThunk =>
  async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    dispatch({
      type: ACTION_AUTHENTICATE,
      payload: status,
    });
  };

export const setEnv =
  (value = PRODUCTION_ENV): AppThunk =>
  async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    dispatch({
      type: ACTION_SET_ENV,
      env: value,
    });
  };

export const setLanguage =
  (value = EnglishLanguage): AppThunk =>
  async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    dispatch({
      type: ACTION_SET_LANGUAGE,
      language: value,
    });
  };

export const setApplicationName =
  (value: string): AppThunk =>
  async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    // check if there is same application name as in the local storage
    // then set env same as local storage
    const selectedSpace = getItemFromLocalStorage(
      LOCAL_STORAGE_SELECTED_APPLICATION_NAME
    );
    const selectedEnv = getItemFromLocalStorage(LOCAL_STORAGE_ENV);

    if (selectedSpace === value) {
      dispatch({
        type: ACTION_SET_ENV,
        env: selectedEnv || PRODUCTION_ENV,
      });
    } else {
      dispatch({
        type: ACTION_SET_ENV,
        env: PRODUCTION_ENV,
      });
    }
    dispatch({
      type: ACTION_SET_APPLICATION_NAME,
      applicationName: value,
    });
  };
