import { Grid } from "@material-ui/core";
import { SupportedUserType } from "@ranjodhbirkaur/constants";
import { connect } from "react-redux"
import { Form } from "../../../../components/common/Form";
import { ConfigField, DROPDOWN, TEXT } from "../../../../components/common/Form/interface";
import { RenderHeading } from "../../../../components/common/RenderHeading";
import { RootState } from "../../../../rootReducer";

export const UsersComponent = () => {

    const fields: ConfigField[] = [
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

    return (
        <Grid>
            <RenderHeading
                value='User component'
             />


            <Form 
                getValuesAsObject={true}
                response={''}
                className=''
                onSubmit={onSubmit}
                fields={fields}
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