import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import { Filter } from '../../src/sortingAndFiltering';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from '../../styles/SortAndFilterDropdowns.module.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { iconImg } from '../icons/IconFactory';
import Image from 'next/image';
import { iconAltText, StatusType } from '../constants';

// Customising the table styling using ThemeProvider
export const theme = createTheme({
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: '1rem',
          fontFamily: 'var(--primary-font-family)',
          color: 'black',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
          fontFamily: 'var(--primary-font-family)',
          color: 'black',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
          fontFamily: 'var(--primary-font-family)',
          color: 'black',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          marginLeft: '0.4rem',
          fontSize: '1.1rem',
          fontFamily: 'var(--primary-font-family)',
          color: 'black',
        },
      },
    },
  },
});

export type SortSettings = {
  type:
    | 'name'
    | 'repo'
    | 'rank'
    | 'time'
    | 'internal'
    | 'external'
    | 'total'
    | 'users';
  direction: boolean;
};

export function SortBox(sortSetting: SortSettings, handleSortChange: any) {
  return (
    <ThemeProvider theme={theme}>
      <FormControl className={styles.sortby} fullWidth>
        <InputLabel
          id='sort-by-select-label'
          sx={{ fontSize: '1.3rem', transform: 'translate(10px, -15px)' }}
        >
          Sort by
        </InputLabel>
        <Select
          label='_____ Sort by' //DO NOT REMOVE UNDERSCORES, label is only used for layout, see here https://mui.com/material-ui/api/outlined-input/#props
          labelId='sort-by-select-label'
          value={sortSetting.type}
          onChange={handleSortChange}
          IconComponent={(props) => {
            console.log('Icon props:', props);
            return (
              <ArrowDropDownIcon
                {...props}
                fontSize='large'
                htmlColor='#000000'
              />
            );
          }}
        >
          <MenuItem value=''>
            {' '}
            <em>None</em>{' '}
          </MenuItem>
          <MenuItem value={'name'}>Name</MenuItem>
          <MenuItem value={'repo'}>Repository</MenuItem>
          <MenuItem value={'rank'}>Rank</MenuItem>
          <MenuItem value={'time'}>Time</MenuItem>
          <MenuItem value={'internal'}>Internal count</MenuItem>
          <MenuItem value={'external'}>External count</MenuItem>
          <MenuItem value={'total'}>Total count</MenuItem>
          <MenuItem value={'users'}>User count</MenuItem>
          <MenuItem value={'mostOutdated'}>Most Outdated Dependency</MenuItem>
        </Select>
      </FormControl>
    </ThemeProvider>
  );
}

export function RankSelectionList(
  filterSetting: Filter,
  handleRankSelectionChange: any
) {
  const rankSelectionValue = [
    ...(filterSetting.showRed ? ['Highly-Outdated'] : []),
    ...(filterSetting.showYellow ? ['Moderately-Outdated'] : []),
    ...(filterSetting.showGreen ? ['Up-To-Date'] : []),
  ];

  const ICON_SIZE = '24px';

  return (
    <>
      <ThemeProvider theme={theme}>
        <FormControl fullWidth>
          <InputLabel
            id='filter-select-label'
            sx={{ fontSize: '1.3em', transform: 'translate(10px, -15px)' }}
          >
            Filter
          </InputLabel>
          <Select
            label='___ Filter' //DO NOT REMOVE UNDERSCORES, label is only used for layout, see here https://mui.com/material-ui/api/outlined-input/#props
            labelId='filter-select-label'
            multiple
            value={rankSelectionValue}
            onChange={handleRankSelectionChange}
            renderValue={(selected: string[]) => selected.join(', ')}
            IconComponent={(props) => (
              <ArrowDropDownIcon
                {...props}
                fontSize='large'
                htmlColor='#000000'
              />
            )}
          >
            {[
              <MenuItem value={'Highly-Outdated'} key={'Highly-Outdated'}>
                <Checkbox checked={filterSetting.showRed} />
                <Image
                  layout='fixed'
                  alt={iconAltText[StatusType.RED]}
                  src={iconImg[StatusType.RED]}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
                <ListItemText primary={'Highly-Outdated'} />
              </MenuItem>,
              <MenuItem
                value={'Moderately-Outdated'}
                key={'Moderately-Outdated'}
              >
                <Checkbox checked={filterSetting.showYellow} />
                <Image
                  layout='fixed'
                  alt={iconAltText[StatusType.YELLOW]}
                  src={iconImg[StatusType.YELLOW]}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
                <ListItemText primary={'Moderately-Outdated'} />
              </MenuItem>,
              <MenuItem value={'Up-To-Date'} key={'Up-To-Date'}>
                <Checkbox checked={filterSetting.showGreen} />
                <Image
                  layout='fixed'
                  alt={iconAltText[StatusType.GREEN]}
                  src={iconImg[StatusType.GREEN]}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
                <ListItemText primary={'Up-To-Date'} />
              </MenuItem>,
            ]}
          </Select>
        </FormControl>
      </ThemeProvider>
    </>
  );
}
