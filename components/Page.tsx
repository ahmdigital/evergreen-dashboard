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
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { RankSelectionList, SortBox, SortSettings } from "./SortAndFilterDropdowns";
import { applySort, Filter, rankCounts, searchAndFilter } from "../src/sortingAndFiltering";

export type PageProps = {
	JSObject: DependencyData;
	finalData: boolean;
};

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
	const [sortSetting, setSortSetting] = useState<SortSettings>({ type: "rank", direction: true });
	const [filterSetting, setFilterSetting] = useState<Filter>({ type: "", level: 0, direction: false, mustHaveDependency: -1, showRed: true, showYellow: true, showGreen: true });
	const rows = useProcessDependencyData(props.JSObject);


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
	const sortDirectionBox = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
		<InputLabel>Sort direction</InputLabel>
		<Select
			value={sortSetting.direction ? "ascending" : "descending"}
			onChange={handleSortDirectionChange}
			label="Sort direction"
		>
			<MenuItem value={"ascending"}>ascending</MenuItem>
			<MenuItem value={"descending"}>descending</MenuItem>
		</Select>
	</FormControl>

	return (
		<div className="container">
			<Head>
				<title>Evergreen dashboard</title>
			</Head>
			<main style={{ padding: 0 }}>
				<Layout>
					<SummaryContainer rankArray={rankArray} loadingBackdrop={loadingBackdrop} rows={rows} filterTerm={filterSetting} setFilterTerm={setFilterSetting} />
					<div>{sortDirectionBox}</div>
					<DependenciesContainer
						JSObject={props.JSObject}
						rows={diplayedRows}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						sortDropdown={sortBox}
						rankSelection={rankSelectionList}
					/>
				</Layout>
			</main>
		</div>
	);
}
