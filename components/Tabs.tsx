import React, { SyntheticEvent, useState } from "react";
import Tabss from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabss
          value={tabVal}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Internal" />
          <Tab label="External" />
        </Tabss>
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
