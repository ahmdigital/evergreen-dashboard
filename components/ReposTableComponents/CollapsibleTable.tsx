import { ReactNode } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "../../styles/CollapsibleTable.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

type CollapsibleTableProps = {
  children: ReactNode;
};


// Customising the table styling using ThemeProvider
const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontWeight: "var(--font-weight-semibolder)",
          fontSize: "var(--font-size-large)",
          fontFamily: 'var(--primary-font-family)',
          backgroundColor: "var(--table-cell-background)",
          color: "var(--colour-font)",
          marginTop: '1rem',
          lineHeight: '3rem',
          borderColor: "var(--table-cell-border)",
          borderWidth: '0.2rem'
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        }
      }
    }
  }
})

// Creates the whole table
export default function CollapsibleTable(props: CollapsibleTableProps) {
  return (
	<ThemeProvider theme={theme}>
    <TableContainer
      component={Paper}
      className={styles.tableComponent}
    >
      <Table size="small" aria-label="collapsible table" className={styles.tableFixedWidth}>
        <colgroup>
          <col className={styles.col1} />
          <col className={styles.col2} />
          <col className={styles.col3} />
          <col className={styles.col4} />
          <col className={styles.col5} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>status</TableCell>
            <TableCell>name</TableCell>
            <TableCell>version</TableCell>
            <TableCell>last push</TableCell>
          </TableRow>
        </TableHead>
        <TableBody id={"mainTableBody"}>{props.children}</TableBody>
      </Table>
    </TableContainer>
	</ThemeProvider>
  );
}
