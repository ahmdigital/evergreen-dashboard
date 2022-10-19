import React, { SyntheticEvent, useState, ReactNode } from 'react';
import Tabss from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import InternalTable from './InternalTable';
import UsersTable from './UsersTable';

import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Props } from './Row';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  isEmpty: boolean;
}

// Using createTheme for customising Tabs text
const useStyles = makeStyles((_) => ({
  indicator: {
    backgroundColor: 'black',
    height: '0.625rem', //'10px'
    top: '2.813rem', //'45px'
    color: 'black',
    marginTop: '0.825rem',
  },
}));

//Using createTheme for customising Tabs text colors
const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          '&.Mui-selected': {
            color: '#000000',
            fontWeight: '600',
          },
        },
        root: {
          textTransform: 'none',
          fontWeight: 'var(--font-weight-normal)', //400
          fontSize: 'var(--font-size-normal)',
          fontFamily: 'var(--primary-font-family)',
          //   width: '30%',
          //   paddingRight: '40px',
          //   maxWidth: '18.75rem', //'300px'
          textAlign: 'left',
          flexDirection: 'row',
          color: 'var(--colour-black)',
          border: 'var(--colour-black)',
        },
        textColorSecondary: {
          color: 'var(--colour-black)',
          textTransform: 'none',
          fontWeight: 'normal',
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        root: {},
        badge: {
          backgroundColor: 'black',
          left: '0.5rem', //8px
          top: 'unset',
        },
      },
    },

    MuiButtonBase: {
      styleOverrides: {
        root: {
          justifyContent: 'flex-start',
        },
      },
    },
  },
});

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, isEmpty, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: isEmpty ? '24px' : '0px 0px 24px 24px' }}>
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
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  return (
    <Box
      sx={{
        paddingRight: {
          xs: '40px',
          md: '80px',
          lg: '120px',
        },
        ...boxStyle,
      }}
    >
      <label style={{ maxWidth: '6.25rem' /* 100px */ }}>
        {props.headerTitle}
      </label>
      <Badge badgeContent={props.badgeValue} color="primary" showZero></Badge>
    </Box>
  );
};

const Tabs = (
  props: Props & {
    tableFunc?: (elem: ReactNode, variant: 'dependency' | 'user') => ReactNode;
  }
) => {
  // Creates the tab menu & displays the internal/external data
  const internal = props.subRows.internal;
  const external = props.subRows.external;
  const user = props.subRows.user;

  const internalTable = props.tableFunc ? (
    props.tableFunc(internal, 'dependency')
  ) : (
    <InternalTable tableRows={internal}></InternalTable>
  );
  const externalTable = props.tableFunc ? (
    props.tableFunc(external, 'dependency')
  ) : (
    <InternalTable tableRows={external}></InternalTable>
  );
  const userTable = props.tableFunc ? (
    props.tableFunc(user, 'user')
  ) : (
    <UsersTable tableRows={user}></UsersTable>
  );

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
    <TabPanel
      key="internal"
      value={tabVal}
      index={0}
      isEmpty={internal.length === 0}
    >
      {internal.length > 0 ? internalTable : 'No depedencies found'}
    </TabPanel>,
    <TabPanel
      key="external"
      value={tabVal}
      index={1}
      isEmpty={external.length === 0}
    >
      {external.length > 0 ? externalTable : 'No depedencies found'}
    </TabPanel>,
    <TabPanel key="users" value={tabVal} index={2} isEmpty={user.length === 0}>
      {user.length > 0 ? userTable : 'No dependent repositories found'}
    </TabPanel>,
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1 }}>
        <ThemeProvider theme={theme}>
          <Tabss
            value={tabVal}
            onChange={handleChange}
            aria-label=""
            variant="scrollable"
            scrollButtons="auto"
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
