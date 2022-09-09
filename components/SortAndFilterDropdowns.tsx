import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";
import { Filter } from "../src/sortingAndFiltering";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styles from './SortAndFilterDropdowns.module.css'

// Customising the table styling using ThemeProvider
const theme = createTheme({
	components: {
		MuiSelect: {
			styleOverrides: {
				select: {
					fontSize: "1rem",
					fontFamily: 'var(--primary-font-family)',
					borderColor: "var(--table-cell-border)",

					// color: "var(--colour-font)",
					// marginTop: '1rem',
					// lineHeight: '3rem',

					// borderWidth: '0.2rem',
				}
			}
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					fontSize: "1.1rem",
				}
			}
		}
	}
})


export type SortSettings = { type: "name" | "rank" | "time" | "internal" | "external" | "total" | "users", direction: boolean }

export function SortBox(sortSetting: SortSettings, handleSortChange: any) {
	return <ThemeProvider theme={theme}>
		<FormControl className={styles.sortby} sx={{ m: 1, minWidth: 120 }}>
			<InputLabel>Sort by</InputLabel>
			<Select
				className={styles.sortby}
				value={sortSetting.type}
				onChange={handleSortChange}
				label="Sort by"
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

	return <ThemeProvider theme={theme}>
		<FormControl sx={{ m: 1, minWidth: 120 }}>
			<InputLabel>Filter</InputLabel>
			<Select
				multiple
				value={rankSelectionValue}
				onChange={handleRankSelectionChange}
				renderValue={(selected: string[]) => selected.join(', ')}
				input={<OutlinedInput label="Tag" />}
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
}

// const rankCutoffBox = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
// <InputLabel>Filters</InputLabel>
// <Select
// 	value={filterSetting.type}
// 	onChange={handleFilterChange}
// 	label="Filters"
// >
// 	<MenuItem value=""> <em>None</em> </MenuItem>
// </Select>
// </FormControl>

// const handleFilterChange = (event: SelectChangeEvent) => {
// 	const sel = event.target.value;
// 	if (sel in ["", "time"]) {
// 		setFilterSetting({ ...filterSetting, type: sel as "" | "time" })
// 	}
// }

// //TODO: Change to using buttons
// const filterCutoffDirectionBox = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
// 	<InputLabel>Rank cutoff direction</InputLabel>
// 	<Select
// 		value={filterSetting.direction ? "ascending" : "descending"}
// 		onChange={handleFilterCutoffDirectionChange}
// 		label="Rank cutoff direction"
// 	>
// 		<MenuItem value={"ascending"}>ascending</MenuItem>
// 		<MenuItem value={"descending"}>descending</MenuItem>
// 	</Select>
// </FormControl>

// //TODO: Adapt to sorting buttons this
// const handleFilterCutoffDirectionChange = (event: SelectChangeEvent) => {
// 	setFilterSetting({ ...filterSetting, direction: event.target.value == "ascending" })
// }
