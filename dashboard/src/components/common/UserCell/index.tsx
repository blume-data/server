import React from "react";
import {Link} from 'react-router-dom';
import {Tooltip} from "@material-ui/core";

interface UserCellType {
    value?: any;
}

export const UserCell = (props: UserCellType) => {

    const {value} = props;

    if(value && value.firstName && value.lastName && value.id) {

        const name = `${value.firstName} ${value.lastName}`;

        return (
            <Tooltip title={name}>
                <div className="user-cell-wrapper">
                    <Link to={`/${value.id}`} className={'user-cell-link'}>
                        <p>{name}</p>
                    </Link>
                </div>
            </Tooltip>
        );
    }
    else return null
}