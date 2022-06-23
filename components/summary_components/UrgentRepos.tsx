import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import styles from "../../components/summary_components/UrgentRepos.module.css";

export default function UrgentRepos() {
    return (
        <Table>
            <TableRow>
                <TableCell className={styles.tableCellStyle}>
                    <p>github-pu-release</p>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={styles.tableCellStyle}>
                    <p>github-pu-release</p>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={styles.tableCellStyle}>
                    <p>github-pu-release</p>
                </TableCell>
            </TableRow>
        </Table>
    );
}
