
import { CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Form } from "../../../../../components/common/Form";
import Card from "@mui/material/Card";
import { ConfigField } from "../../../../../components/common/Form/interface";
import { ErrorMessagesType } from "@ranjodhbirkaur/constants";

interface RegisterType {
  onSubmit: (values: object[]) => void;
  fields: ConfigField[];
  title: string;
  response: string | ErrorMessagesType[];
  loading?: boolean;
  submitButtonName?: string;
}

export const CardForm = (props: RegisterType) => {
  const { onSubmit, fields, title, response, submitButtonName, loading } =
    props;
  return (
    <Card className={"auth-page-form-card"}>
      <CardContent>
        <Typography variant={"h3"}>{title}</Typography>
      </CardContent>
      <Form
        loading={loading}
        submitButtonName={submitButtonName}
        showClearButton={true}
        response={response}
        clearOnSubmit={false}
        onSubmit={onSubmit}
        fields={fields}
        className={"auth-form"}
      />
    </Card>
  );
};
