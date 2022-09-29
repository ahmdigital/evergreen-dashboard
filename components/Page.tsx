import React, { useState } from "react";
import { ProcessedDependencyData, useProcessDependencyData } from "../hooks/useProcessDependencyData";
import Layout from "./Layout";
import Head from "next/head";
import DependenciesContainer from "./ReposTableComponents/DependenciesContainer";
import SummaryContainer from "./SummaryComponents/SummaryContainer";
import { DependencyData } from "../src/dataProcessing";
import LoadingSnackbar from "./FeedbackComponents/LoadingSnackbar";
import HelpGuide from "./HelpComponents/HelpGuide";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { RankSelectionList, SortBox, SortSettings } from "./ReposTableComponents/SortAndFilterDropdowns";
import { applySort, Filter, rankCounts } from "../src/sortingAndFiltering";
import { createTheme, ThemeProvider } from "@mui/material/styles";


export type PageProps = {
	JSObject: DependencyData;
	finalData: boolean;
};

// Customising the table styling using ThemeProvider
const theme = createTheme({
	components: {
		MuiSelect: {
			styleOverrides: {
				select: {
					fontSize: "1rem",
					fontFamily: 'var(--primary-font-family)',
					color: 'black',
				}
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

export function Page(props: PageProps) {

	// Using react state for table data
	const rows = useProcessDependencyData(props.JSObject);
	const [tableRows, setTableRows] = useState<ProcessedDependencyData>(useProcessDependencyData(props.JSObject))
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortSetting, setSortSetting] = useState<SortSettings>({ type: "rank", direction: true });
	const [filterSetting, setFilterSetting] = useState<Filter>({ type: "", level: 0, direction: false, mustHaveDependency: -1, showRed: true, showYellow: true, showGreen: true });

	// check if there are no rows
	let emptyRows = tableRows.length === 0;

	let loadingSnackbar: any = null;
	// If the final data is loading, then set the backdrop open to true
	if (!props.finalData) {
		loadingSnackbar = (
			<>
				<LoadingSnackbar open={true} />
			</>
		)
	}

	//Sorting. Doing this after filtering would be more efficient
	applySort(tableRows, sortSetting)

	const rankArray = rankCounts(tableRows)

	const sortBox = SortBox(sortSetting, (event: SelectChangeEvent) => {
		setSortSetting({ type: event.target.value as any, direction: sortSetting.direction })
	})

	const rankSelectionList = RankSelectionList(filterSetting, (event: SelectChangeEvent<string[]>) => {
		const sel = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
		setFilterSetting({ ...filterSetting, showRed: sel.indexOf("red") != -1, showYellow: sel.includes("yellow"), showGreen: sel.includes("green") })
	})

	//TODO: Adapt to sorting buttons this
	const handleSortDirectionChange = (event: SelectChangeEvent) => {
		setSortSetting({ type: sortSetting.type, direction: event.target.value == "ascending" })
	}

	//TODO: Replace this
	const sortDirectionBox = <ThemeProvider theme={theme}>
		<FormControl sx={{ m: 1, minWidth: 138, maxWidth: 138 }}>
			<p>Sort Direction</p>
			<Select
				value={sortSetting.direction ? "ascending" : "descending"}
				onChange={handleSortDirectionChange}
			>
				<MenuItem value={"ascending"}>Ascending</MenuItem>
				<MenuItem value={"descending"}>Descending</MenuItem>
			</Select>
		</FormControl></ThemeProvider>

	return (
		<div className="container">
			<Head>
				<title>Evergreen dashboard</title>
			</Head>
			<main style={{ padding: 0 }}>
				<Layout>
					<SummaryContainer rankArray={rankArray} loadingSnackbar={loadingSnackbar} rows={rows} filterTerm={filterSetting} setFilterTerm={setFilterSetting} />
					<DependenciesContainer
						JSObject={props.JSObject}
						tableRows={tableRows}
						setTableRows={setTableRows}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						sortDropdown={sortBox}
						sortDirection={sortDirectionBox}
						rankSelection={rankSelectionList}
						emptyRows={emptyRows}
					/>
					<HelpGuide />
				</Layout>
			</main>
		</div>
	);
}
