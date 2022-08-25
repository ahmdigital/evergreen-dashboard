import * as React from 'react';
import { Fab } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import HelpOutline from "@mui/icons-material/HelpOutline";
import styles from "./HelpGuide.module.css";
import { styled } from '@mui/material/styles';

// defining style for custom tooltip
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#8F8F8F',
      color: '#FFFFFF',
      boxShadow: theme.shadows[1],
      fontSize: 16,
      fontFamily: 'Work Sans',
    },
}));


export default function HelpGuide() {
    return (
      <>
        <LightTooltip title="Help Guide">
            <Fab className={styles.fabStyle}>
                <HelpOutline className={styles.iconStyle}/>
            </Fab>
        </LightTooltip>
      </>
    );
  }
  