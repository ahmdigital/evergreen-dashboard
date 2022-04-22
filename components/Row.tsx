import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { makeStyles } from "@mui/styles";

import { Colours } from "./Colours";

import Tabs from "./Tabs";
import { DependencyData, semVerToString } from "./dataProcessing";

import styles from "../components/row.module.css";
import { Circle } from "@mui/icons-material";
import { Typography } from "@mui/material";

//This doesn't get applied until a partial refresh.
const useStyles = makeStyles({
  tableCell: {
    fontWeight: "normal",
    fontFamily: "Noto Sans, sans-serif",
  },
});

// Creates each invidial row
export default function Row(props: {
  rank: number;
  row: any;
  subRows: { internal: any[]; external: any[]; user: any[]; final: boolean };
}) {
  const { rank, row, subRows } = props;
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  //Get a reference to each name, as the names are changed(autogenerated) after compilation
  const Styles = {
    plain: styles.tableRow_plain,
    red: styles.tableRow_red,
    orange: styles.tableRow_orange,
    green: styles.tableRow_green,
  };

  return (
    <>
      <TableRow
      // className={
      //   rank == 0
      //     ? Styles.red
      //     : rank == 1
      //     ? Styles.orange
      //     : rank == 2
      //     ? Styles.green
      //     : Styles.plain
      // }
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* //The circle
				<TableCell>
						<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
							<circle cx="20" cy="20" r="20"/>
						</svg>
				</TableCell> */}
        <TableCell className={classes.tableCell} component="th" scope="row">
          <Circle
            sx={
              rank == 0
                ? { color: "red", paddingRight: "5px" }
                : rank == 1
                ? { color: "orange", paddingRight: "5px" }
                : rank == 2
                ? { color: "green", paddingRight: "5px" }
                : { color: "white", paddingRight: "5px" }
            }
          />
		  {row.name}
        </TableCell>
        <TableCell className={classes.tableCell} align="right">
          {semVerToString(row.version)}
        </TableCell>
        <TableCell className={classes.tableCell} align="right">
          (
          <a href={row.link} target="_blank">
            GitHub
          </a>
          )
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#FFF" }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Tabs subRows={subRows}></Tabs>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
