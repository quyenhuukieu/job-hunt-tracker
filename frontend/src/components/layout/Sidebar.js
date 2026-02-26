import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <Drawer variant="permanent" sx={{ width: 240 }}>
            <List>
                <ListItem button onClick={() => navigate("/dashboard")}>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;