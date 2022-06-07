import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Circle } from "@mui/icons-material";
import {Colours} from "../../components/Colours"
import styles from "../../components/summary_components/ReposOverviewTable.module.css";


export default function ReposOverViewTable() {
    return (
        <Table>
            <TableRow>
                <TableCell className={styles.tableCellStyle}>
                    <Circle style = {{color: Colours.red, paddingRight: "5px"}} />
                </TableCell>
                <TableCell className={styles.tableCellStyle}>
                    <p>23 repos</p>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={styles.tableCellStyle}>
                    <Circle style = {{color: Colours.orange, paddingRight: "5px"}} />
                </TableCell>
                <TableCell className={styles.tableCellStyle}>
                    <p>47 repos</p>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={styles.tableCellStyle}>
                    <Circle style = {{color: Colours.green, paddingRight: "5px"}} />
                </TableCell>
                <TableCell className={styles.tableCellStyle}>
                    <p>19 repos</p>
                </TableCell>
            </TableRow>
        </Table>
    );
}