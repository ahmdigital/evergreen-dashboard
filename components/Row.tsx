import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Circle } from "@mui/icons-material";

import Tabs from "./Tabs";
import {semVerToString, rankToDepColour} from "../src/semVer";
import styles from "../components/row.module.css";

export type Props = {
	subRows: { internal: JSX.Element[], external: JSX.Element[], user: JSX.Element[], final: boolean }
}

// Creates each individual row
export default function Row(props: {rank: number, row: any} & Props) {
  const { rank, row, subRows } = props;
  const [open, setOpen] = useState(false);

  let colour = rankToDepColour(rank)[0]

  return (
    <React.Fragment>
      <TableRow style={{ color: "var(--colour-font)" }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            style={{ color: "gray" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Circle style = {{color: colour, paddingRight: "5px"}} />
        </TableCell>
        <TableCell className={styles.tableCellStyle} component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell className={styles.tableCellStyle} align="left">
          {semVerToString(row.version)}
        </TableCell>
        <TableCell className={styles.tableCellStyle} align="right">
          (
          <a href={row.link} rel="noreferrer" target="_blank">
            GitHub
          </a>
          )
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "var(--colour-background)" }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="dependencies">
                <TableHead style={{ backgroundColor: "var(--colour-background)", color: "var(--colour-font)" }}>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Tabs subRows={subRows}></Tabs>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
