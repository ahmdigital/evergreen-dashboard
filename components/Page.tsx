import React, { useState } from "react";
import { InverseSubRow } from "./InverseSubRow";
import { SubRow } from "./SubRow";
import { ProcessedDependencyData, useProcessDependencyData } from "../hooks/useProcessDependencyData";
import Row from "./Row";
import Layout from "./Layout";
import Head from "next/head";
import DependenciesContainer from "./DependenciesContainer";
import SummaryContainer from "./SummaryContainer";
import { DependencyData } from "../src/dataProcessing";
import LoadingBackdrop from "./LoadingBackdrop";
import HelpGuide from "./HelpComponents/HelpGuide";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { RankSelectionList, SortBox, SortSettings } from "./SortAndFilterDropdowns";
import { applySort, Filter, rankCounts, searchAndFilter } from "../src/sortingAndFiltering";
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


function rowsToJSX(rows: ProcessedDependencyData) {
	return rows.map((row) => (
		<Row
			key={row.name}
			rank={row.minRank}
			row={row}
			subRows={{
				internal: row.internalSubRows.map((i) => (
					<SubRow key={i.name} dependency={i} />
				)),
				external: row.externalSubRows.map((i) => (
					<SubRow key={i.name} dependency={i} />
				)),
				user: row.userSubRows.map((i) => (
					<InverseSubRow key={i.name} user={i} />
				)),
				final: row.userSubRows.length === 0,
			}}
		/>
	))
}

export function Page(props: PageProps) {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const rows = useProcessDependencyData(props.JSObject);
	const [sortSetting, setSortSetting] = useState<SortSettings>({ type: "rank", direction: true });
	const [filterSetting, setFilterSetting] = useState<Filter>({ type: "", level: 0, direction: false, mustHaveDependency: -1, showRed: true, showYellow: true, showGreen: true });

	// check if there are no rows
	let emptyRows = rows.length === 0;

	let loadingBackdrop: any = null;
	// If the final data is loading, then set the backdrop open to true
	if (!props.finalData) {
		loadingBackdrop = (
			<>
				<LoadingBackdrop open={true} />
			</>
		)
	}

	//Sorting. Doing this after filtering would be more efficient
	applySort(rows, sortSetting)

	

	const jsxRows = rowsToJSX(rows)
	const rankArray = rankCounts(rows)

	const diplayedRows = searchAndFilter(rows, jsxRows, filterSetting, searchTerm)

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
					<SummaryContainer rankArray={rankArray} loadingBackdrop={loadingBackdrop} rows={rows} filterTerm={filterSetting} setFilterTerm={setFilterSetting} />
					<DependenciesContainer
						JSObject={props.JSObject}
						rows={diplayedRows}
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
