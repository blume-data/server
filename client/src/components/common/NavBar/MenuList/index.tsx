import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";

interface ApplicationNamesListProps {
    onSelectMenuItem: (name: string) => void;
    menuName: string;
    menuItems: string[];
    id: string;
    defaultName: string;

}
export const MenuList = (props: ApplicationNamesListProps) => {

    const {menuName, onSelectMenuItem, menuItems, id, defaultName} = props;
    const [MenuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
    console.log('menu items', menuItems);

    function openMenu(event: React.MouseEvent<HTMLButtonElement>){
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
        <Grid container justify={"flex-start"}>
            <Button
                aria-controls={id}
                aria-haspopup="true"
                onClick={openMenu}>
                {
                    menuName ? menuName : defaultName
                }
            </Button>
            <Menu
                id={id}
                anchorEl={MenuAnchor}
                keepMounted
                open={Boolean(MenuAnchor)}
                onClose={onMenuClose}
            >
                {
                    menuItems && menuItems.map(menuItem => {
                        return (
                            <MenuItem
                                onClick={() => onSelect(menuItem)}
                                key={menuItem}>
                                {menuItem}
                            </MenuItem>
                        );
                    })
                }
            </Menu>
        </Grid>
    );
};