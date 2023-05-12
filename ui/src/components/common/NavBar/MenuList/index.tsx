
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Grid, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import "./menu-list.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
    <Grid container={true} justifyContent={"flex-start"} className={"menu-list-container"}>
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
