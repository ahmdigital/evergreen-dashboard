
import * as React from 'react';
import { Dialog, DialogTitle } from "@mui/material";

export interface HelpGuideDialogProps {
    open: boolean;
    onClose: (value: string) => void;
}

export default function HelpGuideDialog(props: HelpGuideDialogProps) {

    const { onClose, open } = props;

    return (
        <Dialog open={open}>
            <DialogTitle>Help Guide!</DialogTitle>
        </Dialog>
    );
}
