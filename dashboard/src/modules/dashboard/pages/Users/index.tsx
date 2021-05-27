import { Grid } from "@material-ui/core";
import { SupportedUserType } from "@ranjodhbirkaur/constants";
import React from "react";
import { connect } from "react-redux"
import { AccordianCommon } from "../../../../components/common/AccordianCommon";
import { CommonButton } from "../../../../components/common/CommonButton";
import { Form } from "../../../../components/common/Form";
import { ConfigField, DROPDOWN, TEXT } from "../../../../components/common/Form/interface";
import { RenderHeading } from "../../../../components/common/RenderHeading";
import { RootState } from "../../../../rootReducer";

export const UsersComponent = () => {

    const userModelfields: ConfigField[] = [
        {
            name: 'userName',
            required: true,
            placeholder: 'Username',
            label: 'Username',
            className: '',
            value: '',
            inputType: TEXT
        },
        {
            name: 'password',
            required: true,
            placeholder: 'Password',
            label: 'Password',
            className: '',
            value: '',
            inputType: TEXT
        },
        {
            name: 'type',
            required: true,
            placeholder: 'User type',
            label: 'User type',
            className: '',
            value: '',
            inputType: DROPDOWN,
            options: SupportedUserType.map((userType: any) => {
                return {
                    label: userType,
                    value: userType
                }
            })
        },
        
    ];

    function onSubmit(values: any) {
        console.log('values', values);
    }

    function userModel() {
        return (
            <Grid container justify="space-between">
                <Grid item>
                    <RenderHeading
                        value="user model"
                    />
                </Grid>
                <Grid>
                    <CommonButton
                        name='user group'
                     />
                </Grid>
                
            </Grid>
        );
    }

    return (
        <Grid>
            <AccordianCommon 
                name={'User model'}
                children={<h1>Uswer Model</h1>}
            />
            <AccordianCommon
                name={'User group'}
                children={userModel()}
            />


            <Form 
                getValuesAsObject={true}
                response={''}
                className=''
                onSubmit={onSubmit}
                fields={userModelfields}
            />

        </Grid>
    )
}

function mapStateToProps(state: RootState) {
    return {
        applicationName: state.authentication.applicationName
    }

}

export const Users = connect(mapStateToProps)(UsersComponent);