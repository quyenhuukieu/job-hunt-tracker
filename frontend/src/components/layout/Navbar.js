import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
    const { logout } = useContext(AuthContext);

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Job Hunt Tracker
                </Typography>
                <Button color="inherit" onClick={logout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;