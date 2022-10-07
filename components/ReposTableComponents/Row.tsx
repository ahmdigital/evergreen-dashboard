import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { Tooltip, TableRow, TableHead, TableCell, Table } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import Image from "next/image";
import { semVerToString } from "../../src/semVer";
import styles from "../../styles/Row.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import QuestionMark from "@mui/icons-material/QuestionMark";
import { rankToStatusType, statusDefinitions, statusLabel } from "../constants";
import { iconImg } from "../icons/IconFactory";

const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

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
          fontFamily: 'var(--secondary-font-family)',
          backgroundColor: "var(--colour-container-background)",
          color: "var(--colour-font)",
        }
      }
    }
  }
})

// Using another theme for collapsible row
const collapsibleTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          fontSize: "1.1rem",
          fontFamily: 'var(--primary-font-family)',
          backgroundColor: "#f5f5f5",
          color: "var(--colour-font)",

        }
      }
    }
  }
})

// Creates each individual row
export default function Row(props: { rank: number; row: any } & Props) {
  const { rank, row, subRows } = props;


  const [open, setOpen] = useState(false);

  const statusType = rankToStatusType[rank];

	const statusIcon = iconImg[statusType];
	const statusText = statusLabel[statusType];
	const iconDefinition = statusDefinitions[statusType];
  const ICON_SIZE = "40px";

  return (
    <React.Fragment>
      <TableRow >
        <ThemeProvider theme={theme}>
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
          <TableCell>
            <Tooltip arrow title={<p className={styles.tooltipStyle}>{iconDefinition}</p>}>
              <div className={styles.iconContainer}>
                <Image
                  layout="fixed"
                  src={statusIcon}
                  alt={statusText}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  className={styles.statusIcon}
                />

              </div>
            </Tooltip>
          </TableCell>
          <TableCell component="th" scope="row">
            <a href={row.link} rel="noreferrer" target="_blank">
              {row.name}
            </a>
          </TableCell>
          <TableCell align="left">
            {semVerToString(row.version)}
            {
              (semVerToString(row.version) === "0.0.0-development" || semVerToString(row.version) === "0.0.0") &&
              <Tooltip arrow title={<p className={styles.tooltipStyle}>This repository was defined with a default version of 0.0.0</p>}>
                <QuestionMark sx={{ width: '1.125rem', height: '1.125rem' }} />
              </Tooltip>
            }
          </TableCell>
          <TableCell align="left">
            {dayjs(row.lastUpdated).fromNow()}
          </TableCell>
        </ThemeProvider>
      </TableRow>
      <TableRow>
        <ThemeProvider theme={collapsibleTheme}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={6}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="dependencies">
                  <TableHead className={styles.collapsibleTableHead} >
                    <TableRow >
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
    </React.Fragment >
  );
}
