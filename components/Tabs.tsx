import React, { SyntheticEvent, useState } from "react";
import Tabss from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import InternalTable from "./InternalTable";

import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Props } from "./Row";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Using createTheme for customising Tabs text
const useStyles = makeStyles((_) => ({
  indicator: {
    backgroundColor: "black",
    height: "0.625rem", //"10px"
    top: "2.813rem", //"45px"
    color: "black",
    marginTop: "0.625rem",
  },
}));

//Using createTheme for customising Tabs text colors
const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          "&.Mui-selected": {
            color: "#000000",
          },
        },
        root: {
          textTransform: "none",
          fontWeight: "bold",
          fontFamily: "Work Sans, sans-serif",
          width: "30%",
          maxWidth: "18.75rem", //"300px"
          textAlign: "left",
          flexDirection: "row",
        },
        textColorSecondary: {
          color: "#eeeee4",
          textTransform: "none",
          fontWeight: "normal",
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        root: {},
        badge: {
          backgroundColor: "black",
          left: "0.5rem", //8px
          top: "unset",
        },
      },
    },

    MuiButtonBase: {
      styleOverrides: {
        root: {
          justifyContent: "flex-start",
        },
      },
    },
  },
});

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

type HeaderLabelProps = {
  badgeValue: number;
  headerTitle: string;
};

const HeaderLabel = (props: HeaderLabelProps) => {
  const boxStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  };

  return (
    <Box sx={boxStyle}>
      <label style={{ maxWidth: "6.25rem" /* 100px */ }}>{props.headerTitle}</label>
      <Badge badgeContent={props.badgeValue} color="primary" showZero></Badge>
    </Box>
  );
};

const Tabs = (props: Props) => {
  // Creates the tab menu & displays the internal/external data
  const internal = props.subRows.internal;
  const external = props.subRows.external;
  const user = props.subRows.user;

  const [tabVal, setTabVal] = useState(0);
  const classes = useStyles();
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  let tabLabels = [
    <Tab
      key="internal"
      label={
        <HeaderLabel
          headerTitle="Internal Dependencies"
          badgeValue={internal.length}
        />
      }
    />,
    <Tab
      key="external"
      label={
        <HeaderLabel
          headerTitle="External Dependencies"
          badgeValue={external.length}
        />
      }
    />,
    <Tab
      key="users"
      label={
        <HeaderLabel
          headerTitle="Dependent Repositories"
          badgeValue={user.length}
        />
      }
    />,
  ];

  let tabPanels = [
    <TabPanel key="internal" value={tabVal} index={0}>
      <InternalTable>{internal}</InternalTable>
    </TabPanel>,
    <TabPanel key="external" value={tabVal} index={1}>
      <InternalTable>{external}</InternalTable>
    </TabPanel>,
    <TabPanel key="users" value={tabVal} index={2}>
      <InternalTable>{user}</InternalTable>
    </TabPanel>,
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <ThemeProvider theme={theme}>
          <Tabss
            value={tabVal}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{ className: classes.indicator }}
          >
            {tabLabels}
          </Tabss>
        </ThemeProvider>
      </Box>
      {tabPanels}
    </Box>
  );
};

export default Tabs;
