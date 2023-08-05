import { ErrorMessagesType, RuleType } from "@ranjodhbirkaur/constants";
import { ModelSettingType } from "./ModelSetting";
import { AlertType } from "../../../../../../components/common/Form";

export interface ModelNameType {
  label: string;
  value: string;
}
export interface FieldDataType {
  fieldName?: string;
  fieldDescription?: string;
  fieldMax?: string | number;
  fieldMin?: string | number;
  fieldMatchPattern?: string;
  fieldMatchCustomPattern?: string;
  fieldProhibitPattern?: string;
  fieldMinMaxCustomErrorMessage?: string;
  fieldMatchPatternCustomError?: string;
  fieldProhibitPatternCustomError?: string;
  fieldOnlySpecifiedValues?: string;
  fieldDefaultValue?: string;
  fieldDisplayName?: string;
  fieldIsRequired?: string;
  fieldIsUnique?: string;
  fieldAssetsType?: string;
  fieldType?: string;
}

export interface ContentModelBasicInfoType {
  name: string;
  description: string;
  displayName: string;
  id: string;
  titleProperty: string;
}

export type PropertyType = RuleType[] | null;
export type FormResponseType = string | ErrorMessagesType[];

export interface ContextStateType {
  // modelNames: ModelNameType[];
  // settingFieldName: boolean;
  addingField: boolean;
  // fieldData: FieldDataType;
  // fieldEditMode: boolean;
  hideNames: boolean;
  contentModelData: ContentModelBasicInfoType;
  properties: PropertyType;
  formResponse: FormResponseType;
  // isLoading: boolean;
  isAlertOpen: boolean;
  alert: AlertType;
  // confirmDialogOpen: boolean;
  // deleteEntryName: string;
  modelSetting: ModelSettingType;
}

export interface ContextType extends ContextStateType {
  setAddingField(action: boolean): void;
  setHideNames(action: boolean): void;
  setContentModelData(action: ContentModelBasicInfoType): void;
  setProperties(action: PropertyType): void;
  setFormResponse(action: FormResponseType): void;
  setIsAlertOpen(action: boolean): void;
  setAlertMessage(action: AlertType): void;
  setModelSetting(action: ModelSettingType): void;
  clearAlert(): void;
  onClickAddFields(): void;
  onClickSaveDataModel(
    contentModelData: ContentModelBasicInfoType,
    properties: RuleType[],
    env: string,
    applicationName: string
  ): Promise<void>;
}
