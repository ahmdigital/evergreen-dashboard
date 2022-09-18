import { Checkbox, FormControl, ListItemText, MenuItem, Select } from "@mui/material";
import { Filter } from "../../src/sortingAndFiltering";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styles from '../../styles/SortAndFilterDropdowns.module.css'

// Customising the table styling using ThemeProvider
const theme = createTheme({
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
		<FormControl className={styles.sortby} sx={{ m: 1, minWidth: 160, maxWidth: 220 }}>
			<p>Sort By</p>
			<Select
				value={sortSetting.type}
				onChange={handleSortChange}
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

		<FormControl sx={{ m: 1, minWidth: 200, maxWidth: 200 }}>
			<p>Filter</p>

			<Select
				multiple
				value={rankSelectionValue}
				onChange={handleRankSelectionChange}
				renderValue={(selected: string[]) => selected.join(', ')}
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