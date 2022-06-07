import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function ReposOverViewTable() {
    return (
        <Table>
            <TableRow>
                <TableCell>
                    <p>23 repos</p>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <p>47 repos</p>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <p>19 repos</p>
                </TableCell>
            </TableRow>
        </Table>
    );
}