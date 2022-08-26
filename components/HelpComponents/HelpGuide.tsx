import React, { useState } from "react";
import { Fab, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@mui/material";
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
    // State for opening the help guide
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = (value: string) => {
      setOpen(false);
    };

    return (
      <>
        <LightTooltip title="Help Guide">
            <Fab className={styles.fabStyle} onClick={handleClickOpen}>
                <HelpOutline className={styles.iconStyle}/>
            </Fab>
        </LightTooltip>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Help Guide!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This is a general help guide for the evergreen dashboard.
                </DialogContentText>
            </DialogContent>
        </Dialog>
      </>
    );
  }
  