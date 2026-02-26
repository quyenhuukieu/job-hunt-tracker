import React, { useEffect, useState } from "react";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { apiRequest } from "../api/client";

const Dashboard = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApps = async () => {
            const data = await apiRequest("/applications");
            setApplications(data);
        };

        fetchApps();
    }, []);

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Applications
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Company</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date Applied</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>{app.company}</TableCell>
                                <TableCell>{app.role}</TableCell>
                                <TableCell>{app.status}</TableCell>
                                <TableCell>{app.applied_at}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Dashboard;