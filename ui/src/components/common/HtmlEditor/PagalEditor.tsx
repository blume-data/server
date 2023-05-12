
import { Editor } from "@tinymce/tinymce-react";
import "./style.scss";
import { Grid } from "@mui/material";
interface PagalEditorType {
  value: string;
  setValue: (str: string) => void;
  placeholder?: string;
}

const PagalEditor = (props: PagalEditorType) => {
  const { value, setValue } = props;

  const handleChange = (str: string) => {
    setValue(str);
  };

  return (
    <div className={"text-editor field input-text-component"}>
      <Grid className="control">
        <Editor
          apiKey={"m406r3gdjqg4dvjs4r10p0njjw4zvh4yczzv8bmog98865f4"}
          initialValue={value}
          value={value}
          init={{
            menubar: true,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount autoresize",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help",
          }}
          onEditorChange={handleChange}
        />
      </Grid>
    </div>
  );
};

export default PagalEditor;
