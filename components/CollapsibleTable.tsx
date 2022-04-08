import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import styles from "./CollapsibleTable.module.css";
import Tabs from "./Tabs";

function createData(name: string, version: string, link: string) {
  {
    return {
      name,
      version,
      link,
    };
  }
}

// Sample data for the table
const rows = [
  createData(
    "@octokit/app",
    "12.0.5",
    "https://github.com/octokit/app.js/tree/master"
  ),
  createData(
    "@octokit/core",
    "3.6.0",
    "https://github.com/octokit/core.js/tree/master"
  ),
  createData(
    "@octokit/oauth-app",
    "3.6.0",
    "https://github.com/octokit/oauth-app.js/tree/master"
  ),
  createData(
    "@octokit/plugin-paginate-rest",
    "2.17.0",
    "https://github.com/octokit/plugin-paginate-rest.js/tree/master"
  ),
];

const Row = (props: { row: ReturnType<typeof createData> }) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <TableRow className={styles.tableRow}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.version}</TableCell>
        <TableCell align="right">
          <a href={row.link} target="_blank">
            Open In GitHub
          </a>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Tabs></Tabs>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </div>
  );
};

const CollapsibleTable = () => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell align="left"></TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Version</TableCell>
              <TableCell align="right">Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CollapsibleTable;
