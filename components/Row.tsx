import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { Tooltip, TableRow, TableHead, TableCell, Table } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import QuestionMark from "@mui/icons-material/QuestionMark";
import RedIcon from "./images/redIcon.svg";
import YellowIcon from "./images/yellowIcon.svg";
import greenIcon from "./images/greenIcon.svg";
import Image from "next/image";
import Tabs from "./Tabs";
import { semVerToString } from "../src/semVer";
import styles from "./Row.module.css";
import { redDef, yellowDef, greenDef } from "./LightStatus";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export type Props = {
  subRows: {
    internal: JSX.Element[];
    external: JSX.Element[];
    user: JSX.Element[];
    final: boolean;
  };
};

// Customising the row styling using ThemeProvider
const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          fontSize: "1.1rem",
          fontFamily: 'var(--primary-font-family)',
          backgroundColor: "var(--colour-container-background)",
          color: "var(--colour-font)",
          borderBottom: "none",
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
  let statusIcon = RedIcon;
  let iconDefinition = redDef.description;

  // Setting the status
  if (rank == 2) {
    statusIcon = greenIcon;
    iconDefinition = greenDef.description;
  }
  if (rank == 1) {
    statusIcon = YellowIcon;
    iconDefinition = yellowDef.description;
  }

  return (
    <React.Fragment>
      <TableRow>
        <ThemeProvider theme={theme}>
          <TableCell>
            <IconButton
              aria-label="expand row"
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
                  src={statusIcon}
                  alt="Repo Priority"
                  width="40px"
                  height="40px"
                  className={styles.statusIcon}
                />
              </div>
            </Tooltip>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="left">
            {semVerToString(row.version)}
            {
              (semVerToString(row.version) === "0.0.0-development" || semVerToString(row.version) === "0.0.0") &&
              <Tooltip arrow title={<p className={styles.tooltipStyle}>This repository was defined with a default version of 0.0.0</p>}>
                <QuestionMark className={styles.questionIcon} />
              </Tooltip>
            }
          </TableCell>
          <TableCell align="right">
            (
            <a href={row.link} rel="noreferrer" target="_blank">
              GitHub
            </a>
            )
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
                    <TableRow>
                      <TableCell className={styles.collapsibleTableCell}>
                        <Tabs subRows={subRows}></Tabs>
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

