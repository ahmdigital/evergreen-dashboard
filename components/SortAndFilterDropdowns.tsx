import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from "@mui/material";
import { Filter } from "../src/sortingAndFiltering";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styles from './SortAndFilterDropdowns.module.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Customising the table styling using ThemeProvider
export const theme = createTheme({
	components: {
		MuiSelect: {
			styleOverrides: {
				select: {
					fontSize: "1rem",
					fontFamily: 'var(--primary-font-family)',
					color: 'black',
				},
			}
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					fontSize: "1.1rem",
					fontFamily: 'var(--primary-font-family)',
					color: 'black',
				}
			}
		}
	}
})


export type SortSettings = { type: "name" | "rank" | "time" | "internal" | "external" | "total" | "users", direction: boolean }

export function SortBox(sortSetting: SortSettings, handleSortChange: any) {

	return <ThemeProvider theme={theme}>
		<FormControl className={styles.sortby} fullWidth>
			<InputLabel id="sort-by-select-label" sx={{ fontSize: '1.3em', transform: 'translate(10px, -15px)' }}>
				Sort by
			</InputLabel>
			<Select
				label="_____ Sort by" //DO NOT REMOVE UNDERSCORES, label is only used for layout, see here https://mui.com/material-ui/api/outlined-input/#props
				labelId="sort-by-select-label"
				value={sortSetting.type}
				onChange={handleSortChange}
				IconComponent={(props) => {
					console.log("Icon props:", props)
					return <ArrowDropDownIcon {...props} fontSize='large' htmlColor="#000000" />
				}}
			>
				<MenuItem value=""> <em>None</em> </MenuItem>
				<MenuItem value={"name"}>Name</MenuItem>
				<MenuItem value={"rank"}>Rank</MenuItem>
				<MenuItem value={"time"}>Time</MenuItem>
				<MenuItem value={"internal"}>Internal count</MenuItem>
				<MenuItem value={"external"}>External count</MenuItem>
				<MenuItem value={"total"}>Total count</MenuItem>
				<MenuItem value={"users"}>User count</MenuItem>
				<MenuItem value={"mostOutdated"}>Most Outdated Dependency</MenuItem>
			</Select>
		</FormControl>
	</ThemeProvider>
}

export function RankSelectionList(filterSetting: Filter, handleRankSelectionChange: any) {
	const rankSelectionValue = [
		...(filterSetting.showGreen ? ["green"] : []),
		...(filterSetting.showYellow ? ["yellow"] : []),
		...(filterSetting.showRed ? ["red"] : [])
	]

	return <><ThemeProvider theme={theme}>

		<FormControl fullWidth>
			<InputLabel id="filter-select-label" sx={{ fontSize: '1.3em', transform: 'translate(10px, -15px)' }}>
				Filter
			</InputLabel>
			<Select
				label="___ Filter" //DO NOT REMOVE UNDERSCORES, label is only used for layout, see here https://mui.com/material-ui/api/outlined-input/#props
				labelId="filter-select-label"
				multiple
				value={rankSelectionValue}
				onChange={handleRankSelectionChange}
				renderValue={(selected: string[]) => selected.join(', ')}
				IconComponent={(props) =>
					<ArrowDropDownIcon {...props} fontSize='large' htmlColor="#000000" />
				}
			>
				{[
					<MenuItem value={"green"} key={"green"}>
						<Checkbox checked={filterSetting.showGreen} />
						<ListItemText primary={"green"} />
					</MenuItem>,
					<MenuItem value={"yellow"} key={"yellow"}>
						<Checkbox checked={filterSetting.showYellow} />
						<ListItemText primary={"yellow"} />
					</MenuItem>,
					<MenuItem value={"red"} key={"red"}>
						<Checkbox checked={filterSetting.showRed} />
						<ListItemText primary={"red"} />
					</MenuItem>
				]}
			</Select>
		</FormControl>
	</ThemeProvider>
	</>
}
