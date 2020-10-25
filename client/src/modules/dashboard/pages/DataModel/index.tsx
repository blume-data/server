import React, {useState} from "react";
import {Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {useParams} from "react-router";
import CreateDataModel from "../ApplicationName/DataModels/CreateDataModel";
import ModalDialog from "../../../../components/common/ModalDialog";
import {CreateDataModelItem} from "./CreateDataModellItem";

export const DataModel = () => {

    const {dataModel} = useParams();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <Grid className={'data-model-container'}>

            <Paper elevation={2}>
                <Grid className={'filter-section'} container justify={"space-between"}>
                    <Grid item>
                        <TextField id="filter-stores" label="Filter" />
                    </Grid>
                    <Grid item className={'add-store-button'}>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            variant="contained"
                            color={'primary'}>
                            Add {dataModel}
                        </Button>
                    </Grid>

                </Grid>
            </Paper>

            <ModalDialog
                isOpen={isModalOpen}
                title={'Create Store'}
                handleClose={closeModal}>
                <CreateDataModelItem

                />
            </ModalDialog>

        </Grid>
    );
}