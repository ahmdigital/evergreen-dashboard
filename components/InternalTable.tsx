import { ReactNode } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "./InternalTable.module.css";
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
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    fontFamily: 'var(--primary-font-family)',
                    backgroundColor: "#f5f5f5",
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
                    maxHeight: '18.4rem',
                    overflow: 'scroll',
                    overflowX: 'hidden',
                    boxShadow: 'none',
                }
            }
        }
    }
})

// Creates the interior table
export default function CollapsibleTable(props: CollapsibleTableProps) {
    return (
        <ThemeProvider theme={theme}>
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

                            <TableCell >status</TableCell>
                            <TableCell>name</TableCell>
                            <TableCell >current</TableCell>
                            <TableCell >latest</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>{props.children}</TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    );
}

