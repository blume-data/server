import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import "./styles.scss";
import { SIGN_IN, SIGN_OUT } from "../../../modules/authentication/pages/Auth";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../rootReducer";
import clsx from "clsx";
// import { makeStyles } from "@mui/styles";
import Drawer from "@mui/material/Drawer";
import { LeftDrawerList } from "./LeftDrawerList";
import { NavBarMenu } from "./NavBarMenu";
import { authUrl } from "../../../utils/urls";

type PropsFromRedux = ConnectedProps<typeof connector>;

// const useStyles = makeStyles({
//   list: {
//     width: 250,
//   },
//   fullList: {
//     width: "auto",
//   },
// });

export type Anchor = "top" | "left" | "bottom" | "right";

export const NavBarComponent = (props: PropsFromRedux) => {
  const { isAuth } = props;
  const LEFT_ANCHOR = "left";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (isAuth) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      // Don't open side bar if not authenticated
      if (!isAuth) {
        setState({ ...state, [anchor]: false });
        return;
      }

      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <div
      className={`${clsx('', {
        'full-list': anchor === "top" || anchor === "bottom",
      })} responsive-big-left-drawer`}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <LeftDrawerList />
    </div>
  );

  return (
    <Grid id={"nav-bar-container"}>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar>
          {isAuth ? (
            <IconButton
              onClick={toggleDrawer(LEFT_ANCHOR, true)}
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant="h6" className={"menu-title"}>
            Blumne
          </Typography>
          {isAuth ? (
            <>
              <NavBarMenu />
            </>
          ) : null}

          <Grid container={true} justifyContent={"flex-end"}>
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
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={open}
              onClose={handleClose}
            >
              {isAuth ? (
                <Grid>
                  {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleClose}>My account</MenuItem> */}
                  <Link onClick={handleClose} to={`${authUrl}/${SIGN_OUT}`}>
                    <MenuItem>Log out</MenuItem>
                  </Link>
                </Grid>
              ) : (
                <Link to={`${authUrl}/${SIGN_IN}`}>
                  <MenuItem onClick={handleClose}>Log in</MenuItem>
                </Link>
              )}
            </Menu>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid className="left-drawer-container">
        <Drawer
          anchor={LEFT_ANCHOR}
          open={state[LEFT_ANCHOR]}
          onClose={toggleDrawer(LEFT_ANCHOR, false)}
        >
          {list(LEFT_ANCHOR)}
        </Drawer>
      </Grid>
    </Grid>
  );
};

const mapState = (state: RootState) => ({
  isAuth: state.authentication.isAuth,
});
const connector = connect(mapState);
export const NavBar = connector(NavBarComponent);
