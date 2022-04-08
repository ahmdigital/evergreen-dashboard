import React, { SyntheticEvent, useState } from "react";
import Tabss from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Using createTheme for customising Tabs text
const useStyles = makeStyles((theme) => ({
  indicator: {
    backgroundColor: "black",
    height: "10px",
    top: "45px",
    color: "black",
  },
}));

// Using createTheme for customising Tabs text colors
const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          "&.Mui-selected": {
            color: "#000000",
          }
        },
        root: {
          textTransform: 'none',
          fontWeight: "bold",
        fontSize: 20,
        fontFamily: "Noto Sans, sans-serif",
         },
        textColorSecondary: {
          color: "#eeeee4",
          textTransform: 'none',
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

const Tabs = () => {
  const [tabVal, setTabVal] = useState(0);
  const classes = useStyles();
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <ThemeProvider theme={theme}>
          <Tabss
            value={tabVal}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{ className: classes.indicator }}
            className={classes.tabValue}
          >
            <Tab label="Internal" />
            <Tab label="External" />
          </Tabss>
        </ThemeProvider>
      </Box>
      <TabPanel value={tabVal} index={0}>
        Some Internal data
      </TabPanel>
      <TabPanel value={tabVal} index={1}>
        Some External data
      </TabPanel>
    </Box>
  );
};

export default Tabs;
