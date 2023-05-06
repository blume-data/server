import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Grid, Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "./menu-list.scss";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface ApplicationNamesListProps {
  onSelectMenuItem: (name: string) => void;
  menuName: string;
  menuItems: string[];
  id: string;
  defaultName: string;
}
export const MenuList = (props: ApplicationNamesListProps) => {
  const { menuName, onSelectMenuItem, menuItems, id, defaultName } = props;
  const [MenuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  function openMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setMenuAnchor(event.currentTarget);
  }

  function onMenuClose() {
    setMenuAnchor(null);
  }

  function onSelect(name: string) {
    onSelectMenuItem(name);
    onMenuClose();
  }

  return (
    <Grid container justify={"flex-start"} className={"menu-list-container"}>
      <Tooltip title={"Application Name"} aria-label={"Application Name"}>
        <Button
          className={"application-name-container"}
          endIcon={<ExpandMoreIcon color={"inherit"} />}
          color={"primary"}
          variant={"outlined"}
          aria-controls={id}
          aria-haspopup="true"
          onClick={openMenu}
        >
          {menuName ? menuName : defaultName}
        </Button>
      </Tooltip>
      <Menu
        id={id}
        anchorEl={MenuAnchor}
        keepMounted
        open={Boolean(MenuAnchor)}
        onClose={onMenuClose}
      >
        {menuItems &&
          menuItems.map((menuItem, index) => {
            return (
              <MenuItem
                className={"menu-list-item"}
                onClick={() => onSelect(menuItem)}
                key={index}
              >
                {menuItem}
              </MenuItem>
            );
          })}
      </Menu>
    </Grid>
  );
};
