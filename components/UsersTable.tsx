import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "./InternalTable.module.css";
import { tableBodyStyle, theme as tableTheme } from "./InternalTable";
import { InverseSubRow } from "./InverseSubRow";
import { ThemeProvider } from "@mui/material/styles";

// Creates the interior table
export default function UsersTable(props: { tableRows: any }) {
  return (
    <ThemeProvider theme={tableTheme}>
      <TableContainer component={Paper} className={styles.tableComponent}>
        <Table
          size="small"
          aria-label="collapsible table"
          sx={tableBodyStyle}
        >
          <colgroup>
            <col className={styles.col1} />
            <col className={styles.col2} />
            <col className={styles.col3} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell>status</TableCell>
              <TableCell>name</TableCell>
              <TableCell>current</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.tableRows.map((row: any) => (
                <InverseSubRow key={row.name} user={row} />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}