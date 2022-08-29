import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { Tooltip, TableRow, TableHead, TableCell, Table, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import QuestionMark from "@mui/icons-material/QuestionMark";
import RedIcon from "./images/redIcon.svg";
import YellowIcon from "./images/yellowIcon.svg";
import greenIcon from "./images/greenIcon.svg";
import Image from "next/image";
import Tabs from "./Tabs";
import { semVerToString } from "../src/semVer";
import styles from "./Row.module.css";
import { styled } from '@mui/material/styles';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

export type Props = {
  subRows: {
    internal: JSX.Element[];
    external: JSX.Element[];
    user: JSX.Element[];
    final: boolean;
  };
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: 'var(--font-size-normal)',
    border: '1px solid #dadde9',
  },
}));

// Creates each individual row
export default function Row(props: { rank: number; row: any } & Props) {
  const { rank, row, subRows } = props;
  const [open, setOpen] = useState(false);
  let statusIcon = RedIcon;

  // Setting the status
  if (rank == 2) {
    statusIcon = greenIcon;
  }
  if (rank == 1) {
    statusIcon = YellowIcon;
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell className={styles.tableCellStyle}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
			className={styles.rowArrow}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className={styles.tableCellStyle}>
          <Image
            src={statusIcon}
            alt="Repo Priority"
            width="40px"
            height="40px"
			className={styles.statusIcon}/>
        </TableCell>
        <TableCell className={styles.tableCellStyle} component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell className={styles.tableCellStyle} align="left">
          {semVerToString(row.version)}
          {
            (semVerToString(row.version) === "0.0.0-development" || semVerToString(row.version) === "0.0.0") &&
            <Tooltip arrow title={<p className={styles.tooltipStyle}>This repository was defined with a default version of 0.0.0</p>}>
              <QuestionMark className={styles.questionIcon}/>
            </Tooltip>
          }
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
          className={styles.subRowContainer}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1}}>
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
      </TableRow>
    </React.Fragment>
  );
}
