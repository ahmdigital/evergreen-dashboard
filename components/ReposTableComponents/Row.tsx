import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { Tooltip, TableRow, TableHead, TableCell, Table } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import { semVerToString } from "../../src/semVer";
import styles from "../../styles/Row.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import QuestionMark from "@mui/icons-material/QuestionMark";
import {
  rankToStatusType,
  statusDefinitionsRepos,
  statusLabel,
} from "../constants";
import { iconImg } from "../icons/IconFactory";
import { ProcessedDependencyData } from "../../hooks/useProcessDependencyData";
import { StatusIcon } from "../icons/StatusIcon";
import { SemVerFormatter } from "../SemVerFormatter";

const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export type Props = {
  subRows: {
    internal: any;
    external: any;
    user: any;
    final: boolean;
  };
};

// Customising the row styling using ThemeProvider
const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontWeight: "var(--font-weight-semibold)",
          fontSize: "18px",
          fontFamily: "var(--secondary-font-family)",
          // backgroundColor: "var(--colour-container-background)",
          // color: "var(--colour-font)",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        // Even though there is a hover rule we have to override it here. Don't ask.
        root: {
          "&.MuiTableRow-hover:hover": {
            backgroundColor: "blue",
            cursor: 'pointer',
          },
          backgroundColor: "var(--colour-container-background)",
        },
      },
    },
  },
});

// Using another theme for collapsible row
const collapsibleTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          fontSize: "1.1rem",
          fontFamily: "var(--primary-font-family)",
          backgroundColor: "#f5f5f5",
          color: "var(--colour-font)",
        },
      },
    },
  },
});

type RowProps = {
  row: ProcessedDependencyData[0];
};

// Creates each individual row
export default function Row(props: RowProps) {
  const [open, setOpen] = useState(false);

  // const statusType = rankToStatusType[rank];

  // const statusIcon = iconImg[statusType];
  // const statusText = statusLabel[statusType];
  // const iconDefinition = statusDefinitionsRepos[statusType];
  // const ICON_SIZE = "40px";

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <TableRow onClick={() => setOpen(!open)}>
          {/* ARROW ICON */}
          <TableCell>
            <IconButton
              aria-label="Expand row"
              size="small"
              onClick={() => setOpen(!open)}
              className={styles.rowArrow}
            >
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          </TableCell>

          {/* STATUS */}
          <TableCell>
            <div className={styles.iconContainer}>
              <StatusIcon rank={props.row.minRank} />
            </div>
          </TableCell>

          {/* NAME */}
          <TableCell component="th" scope="row">
            <a href={props.row.link} rel="noreferrer" target="_blank">
              {props.row.name}
            </a>
          </TableCell>

          {/* REPOSITORY NAME */}
          <TableCell component="th" scope="row">
            {props.row.oldName
              ? props.row.oldName.substr(0, props.row.oldName.lastIndexOf("("))
              : ""}
          </TableCell>

          {/* VERSION */}
          <TableCell align="left">
            <SemVerFormatter semver={props.row.version} />
          </TableCell>

          {/* LAST UPDATED TIME */}
          <TableCell align="left">
            {dayjs(props.row.lastUpdated).fromNow()}
          </TableCell>
        </TableRow>
      </ThemeProvider>
      <TableRow>
        <ThemeProvider theme={collapsibleTheme}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="dependencies">
                  <TableHead className={styles.collapsibleTableHead}>
                    <TableRow>
                      <TableCell className={styles.collapsibleTableCell}>
                        {/* <Tabs internal={subRows.internal} external={subRows.external} user={subRows.user}></Tabs> */}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </ThemeProvider>
      </TableRow>
    </React.Fragment>
  );
}
