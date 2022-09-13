import React from "react";
import { Fab, Dialog, DialogTitle, DialogContent, DialogContentText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import HelpOutline from "@mui/icons-material/HelpOutline";
import styles from "./HelpGuide.module.css";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import greenIcon from "../images/greenIcon.svg";
import yellowIcon from "../images/yellowIcon.svg";
import redIcon from "../images/redIcon.svg";
import Image from "next/image";
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Customising the table styling using ThemeProvider
const theme = createTheme({
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          cursor: 'pointer',
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: "10",
          backgroundColor: '#3B5DD9',
          color: 'white',
        }
      }
    }
  }
})

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

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const CustomisedDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle className={styles.helpTitleStyle} sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

// class created to make linking of descriptions to config easier later on
class VersionDefinition {
  description: string;

  constructor(description: string) {
    this.description = description;
  }
}

// defines red, yellow and green traffic light descriptions
let redDef = new VersionDefinition("Current major version behind by more than 1 major or 6 minors.");
let yellowDef = new VersionDefinition("Current minor version behind by 5 or 6 minors.");
let greenDef = new VersionDefinition("Current minor version behind by less than 5 minors.");

// creates the table for the status definitions
function StatusTable() {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>Status</TableCell>
            <TableCell className={styles.fieldContentStyle}>Definition</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Image src={redIcon} alt="Needs updating urgently" width="40px" height="40px"></Image>
            </TableCell>
            <TableCell className={styles.infoContentStyle}>
              {redDef.description}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Image src={yellowIcon} alt="Up to date" width="40px" height="40px"></Image>
            </TableCell>
            <TableCell className={styles.infoContentStyle}>
              {yellowDef.description}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Image src={greenIcon} alt="Should be updated soon" width="40px" height="40px"></Image>
            </TableCell>
            <TableCell className={styles.infoContentStyle}>
              {greenDef.description}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function FieldsTable() {
  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>Status:</TableCell>
            <TableCell className={styles.infoContentStyle}>The status icon represents how up-to-date the repository is</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>Name:</TableCell>
            <TableCell className={styles.infoContentStyle}>The name of the repository</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>Version:</TableCell>
            <TableCell className={styles.infoContentStyle}>Is represented using the semantic versioning standard</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>Last Updated:</TableCell>
            <TableCell className={styles.infoContentStyle}>The time of when the repository was last updated</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>Current:</TableCell>
            <TableCell className={styles.infoContentStyle}>The version of the internal/external library currently used in the repository</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>Latest:</TableCell>
            <TableCell className={styles.infoContentStyle}>The most recent version of the internal/external library.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TabsTable() {
  return (
    <TableContainer className={styles.tableStyle}>
      <Table className={styles.tableStyle}>
        <TableBody>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>Internal:</TableCell>
            <TableCell className={styles.infoContentStyle}>Displays list of internal libraries used by the main repository,
              and their properties including status, library, used version and the latest version of the library</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>External:</TableCell>
            <TableCell className={styles.infoContentStyle}>Displays list of external libraries used by main repository,
              and their properties including status, library, used version and the latest version of the library</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.fieldContentStyle}>Users:</TableCell>
            <TableCell className={styles.infoContentStyle}>Displays list of libraries that uses the main repository,
              and their properties including status, library, used version and the latest version of the library</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// putting components together for help guide
export default function HelpGuide() {
  // State for opening the help guide
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <LightTooltip arrow title="Help Guide">
        <ThemeProvider theme={theme}>
          <Fab onClick={handleClickOpen} aria-label="Help guide button">
            <HelpOutline sx={{ width: '40px', height: '40px' }} className={styles.iconStyle} />
          </Fab>
        </ThemeProvider>
      </LightTooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >
        <CustomisedDialogTitle id="customised-dialog-title" onClose={handleClose}>Need Help?</CustomisedDialogTitle>
        <DialogContent dividers>
          <div className={styles.componentStyle}>
            <ThemeProvider theme={theme}>
              <DialogContentText className={styles.overallHeaderStyle}>Summary</DialogContentText>
            </ThemeProvider>
            <Divider />
            <DialogContentText className={styles.questionHeaderStyle}>
              What do the light status icons represent?
            </DialogContentText>
            <DialogContentText className={styles.infoContentStyle}>
              The application uses 3 types of icons to represent how up-to-date a repository is.
              The status icon is generated based on the semantic versioning of the libraries.
              Below is a more detailed descripton of each icon:
            </DialogContentText>
            <StatusTable />
            <DialogContentText className={styles.questionHeaderStyle}>
              What is Overall Percentage?
            </DialogContentText>
            <DialogContentText className={styles.infoContentStyle}>
              The overall percentage represents the number of repositories with a green light
              status over the total repositories in the organisation as a percentage.
            </DialogContentText>
            <DialogContentText className={styles.questionHeaderStyle}>
              How to read the Total Repositories breakdown card?
            </DialogContentText>
            <DialogContentText className={styles.infoContentStyle}>
              The Total Repos card simply displays the number of repositories defined by each
              light status type; red, yellow, and green.
            </DialogContentText>
          </div>
          <div className={styles.componentStyle}>
            <DialogContentText className={styles.overallHeaderStyle}>Repositories </DialogContentText>
            <Divider />
            <DialogContentText className={styles.questionHeaderStyle}>
              Introduction
            </DialogContentText>
            <DialogContentText className={styles.infoContentStyle}>
              The core feature of the application is to keep track of repositories and how-up-to
              date the internal libraries are. The repositories section displays a table of
              collapsible rows, where each row represents a repository can be expanded to view
              its internal libraries.
            </DialogContentText>
            <DialogContentText className={styles.questionHeaderStyle}>
              Repository Table Fields
            </DialogContentText>
            <FieldsTable />
            <DialogContentText className={styles.questionHeaderStyle}>
              What are the Internal, External and Users tabs?
            </DialogContentText>
            <TabsTable />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
