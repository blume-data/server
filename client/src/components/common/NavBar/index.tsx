import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from "@material-ui/icons/AccountCircle";
import {Link} from "react-router-dom";
import './styles.scss'

export const NavBar = () => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Grid id={'nav-bar-container'} >
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={'menu-title'}>
                        News
                    </Typography>
                    <Grid container justify={'flex-end'}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="nav-bar-menu"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                        <AccountCircle />
                        </IconButton>
                        <Menu
                            id="nav-bar-menu"
                            anchorEl={anchorEl}
                            anchorOrigin={{vertical: 'top', horizontal: 'right',}}
                            keepMounted
                            transformOrigin={{vertical: 'top', horizontal: 'right',}}
                            open={open}
                            onClose={handleClose}>
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <Link to={'/auth'}>
                                <MenuItem onClick={handleClose}>
                                    Log in
                                </MenuItem>
                            </Link>
                        </Menu>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Grid>
    );
};
