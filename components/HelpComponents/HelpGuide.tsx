import React, { PropsWithChildren } from "react";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import HelpOutline from "@mui/icons-material/HelpOutline";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import {
  statusDefinitionsHelpGuide,
  statusLabel,
  StatusType,
} from "../constants";
import styles from "../../styles/HelpGuide.module.css";
import { LightStatusIconFactory } from "../icons/IconFactory";

// Customising the table styling using ThemeProvider
const theme = createTheme({
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          display: "inline-flex",
          alignItems: "center",
          boxSizing: "border-box",
          cursor: "pointer",
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: "10",
          backgroundColor: "#3B5DD9",
          color: "white",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "var(--font-size-normal)",
          fontFamily: "var(--primary-font-family)",
          paddingBottom: "1rem",
          fontWeight: "bold",
          color: "var(--colour- font)",
        },
      },
    },
  },
});

// defining style for custom tooltip
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#8F8F8F",
    color: "#FFFFFF",
    boxShadow: theme.shadows[1],
    fontSize: 16,
    fontFamily: "Work Sans",
  },
}));

export interface DialogTitleProps {
  id: string;
  onClose: () => void;
}

const CustomisedDialogTitle = (props: PropsWithChildren<DialogTitleProps>) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        fontSize: "var(--font-size-xlarge)",
        fontFamily: "var(--primary-font-family)",
        fontWeight: "var(--font-weight-bold)",
        alignSelf: "center",
        m: 0,
        p: 2,
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
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

// creates the table for the status definitions
function StatusTable() {
  const ICON_SIZE = "40px";
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <ThemeProvider theme={theme}>
              <TableCell
                sx={{
                  fontSize: "var(--font-size-normal)",
                  fontFamily: "var(--primary-font-family)",
                  color: "var(--colour-font)",
                  paddingBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "var(--font-size-normal)",
                  fontFamily: "var(--primary-font-family)",
                  color: "var(--colour-font)",
                  paddingBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                Definition
              </TableCell>
            </ThemeProvider>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <LightStatusIconFactory
                toolTip={false}
                type={StatusType.RED}
                iconSize={ICON_SIZE}
              />
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              <p>{`${statusLabel[StatusType.RED]}`}</p>
              <p>{statusDefinitionsHelpGuide[StatusType.RED]}</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <LightStatusIconFactory
                toolTip={false}
                type={StatusType.YELLOW}
                iconSize={ICON_SIZE}
              />
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              <p>{`${statusLabel[StatusType.YELLOW]}`}</p>
              <p>{statusDefinitionsHelpGuide[StatusType.YELLOW]}</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <LightStatusIconFactory
                toolTip={false}
                type={StatusType.GREEN}
                iconSize={ICON_SIZE}
              />
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              <p>{`${statusLabel[StatusType.GREEN]}`}</p>
              <p>{statusDefinitionsHelpGuide[StatusType.GREEN]}</p>
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
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Status:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              The status icon represents how up-to-date the repository is
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Name:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              The name of the repository
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Version:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              Is represented using the semantic versioning standard
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Last Updated:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              The time of when the repository was last updated
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Current:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              The version of the internal/external library currently used in the
              repository
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Latest:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              The most recent version of the internal/external library.
            </TableCell>
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
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Internal:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              Displays list of internal libraries used by the main repository,
              and their properties including status, library, used version and
              the latest version of the library
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              External:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              Displays list of external libraries used by main repository, and
              their properties including status, library, used version and the
              latest version of the library
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Users:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              Displays list of libraries that uses the main repository, and
              their properties including status, library, used version and the
              latest version of the library
            </TableCell>
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
            <HelpOutline
              sx={{ width: "40px", height: "40px" }}
              className={styles.iconStyle}
            />
          </Fab>
        </ThemeProvider>
      </LightTooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <CustomisedDialogTitle
          id="customised-dialog-title"
          onClose={handleClose}
        >
          Need Help?
        </CustomisedDialogTitle>
        <DialogContent dividers>
          <div className={styles.componentStyle}>
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-xlarge)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                fontWeight: "var(--font-weight-bold)",
                paddingTop: "0.5rem",
                paddingBottom: "0.25rem",
              }}
            >
              Summary
            </DialogContentText>
            <Divider />
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-large)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                fontWeight: "var(--font-weight-bold)",
                paddingTop: "1rem",
              }}
            >
              What do the light status icons represent?
            </DialogContentText>
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              The application uses 3 types of icons to represent how up-to-date
              a repository is. The status icon is generated based on the
              semantic versioning of the libraries. Below is a more detailed
              descripton of each icon:
            </DialogContentText>
            <StatusTable />
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-large)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                fontWeight: "var(--font-weight-bold)",
                paddingTop: "1rem",
              }}
            >
              What is Overall Percentage?
            </DialogContentText>
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              The overall percentage represents the number of repositories with
              a green light status over the total repositories in the
              organisation as a percentage.
            </DialogContentText>
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-large)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                fontWeight: "var(--font-weight-bold)",
                paddingTop: "1rem",
              }}
            >
              How to read the Total Repositories breakdown card?
            </DialogContentText>
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              The Total Repos card simply displays the number of repositories
              defined by each light status type; red, yellow, and green.
            </DialogContentText>
          </div>
          <div className={styles.componentStyle}>
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-xlarge)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                fontWeight: "var(--font-weight-bold)",
                paddingTop: "0.5rem",
                paddingBottom: "0.25rem",
              }}
            >
              Repositories{" "}
            </DialogContentText>
            <Divider />
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-large)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                fontWeight: "var(--font-weight-bold)",
                paddingTop: "1rem",
              }}
            >
              Introduction
            </DialogContentText>
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-normal)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                paddingBottom: "1rem",
              }}
            >
              The core feature of the application is to keep track of
              repositories and how-up-to date the internal libraries are. The
              repositories section displays a table of collapsible rows, where
              each row represents a repository can be expanded to view its
              internal libraries.
            </DialogContentText>
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-large)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                fontWeight: "var(--font-weight-bold)",
                paddingTop: "1rem",
              }}
            >
              Repository Table Fields
            </DialogContentText>
            <FieldsTable />
            <DialogContentText
              sx={{
                fontSize: "var(--font-size-large)",
                fontFamily: "var(--primary-font-family)",
                color: "var(--colour-font)",
                fontWeight: "var(--font-weight-bold)",
                paddingTop: "1rem",
              }}
            >
              What are the Internal, External and Users tabs?
            </DialogContentText>
            <TabsTable />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
