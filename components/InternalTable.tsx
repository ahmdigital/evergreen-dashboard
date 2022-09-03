import { ReactNode } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "./InternalTable.module.css";

type CollapsibleTableProps = {
    children: ReactNode;
};

// Creates the interior table
export default function CollapsibleTable(props: CollapsibleTableProps) {
    return (
        <TableContainer
            component={Paper}
            className={styles.tableComponent}
        >
            <Table size="small" aria-label="collapsible table">
                <colgroup>
                    <col className={styles.col1} />
                    <col className={styles.col2} />
                    <col className={styles.col3} />
                    <col className={styles.col4} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell className={styles.tableCellStyle}>status</TableCell>
                        <TableCell className={styles.tableCellStyle}>name</TableCell>
                        <TableCell className={styles.tableCellStyle}>current</TableCell>
                        <TableCell className={styles.tableCellStyle}>latest</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{props.children}</TableBody>
            </Table>
        </TableContainer>
    );
}

