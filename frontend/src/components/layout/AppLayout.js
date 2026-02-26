import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Box, Toolbar } from "@mui/material";

const AppLayout = ({ children }) => {
    return (
        <Box sx={{ display: "flex" }}>
            <Navbar />
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: 30 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default AppLayout;