
// import {Pagination} from '@material-ui/lab';
import Grid from "@mui/material/Grid";
import "./pagination.scss";

export function offsetNumber(page: number, limit: number) {
  return (page - 1) * limit;
}

export function calculateNumberOfPages(totalItems: number, limit: number) {
  //This function return the number of pages listed in the pagination
  return Math.ceil(totalItems / limit);
}

interface PaginationProps {
  limit: number;
  currentPage: number;
  handleChange: any;
  totalItems: number;
  id: string;
}
export function PaginationTab(props: PaginationProps) {
  // const { currentPage, limit, handleChange, totalItems, id } = props;
  console.log("Props", props);
  return (
    <Grid className={"main-pagination-container"}>
      {/* <Pagination
                id={id}
                shape={"round"}
                size={"large"}
                color={"primary"}
                count={calculateNumberOfPages(totalItems, limit)}
                page={currentPage}
                onChange={handleChange}
            /> */}
    </Grid>
  );
}
