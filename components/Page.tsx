import React, { useState } from "react";
import { InverseSubRow } from "./InverseSubRow";
import { SubRow } from "./SubRow";
import { ProcessedDependencyData, useProcessDependencyData } from "../hooks/useProcessDependencyData";
import Row from "./Row";
import Layout from "./Layout";
import Head from "next/head";
import DependenciesContainer from "./DependenciesContainer";
import HeaderContainer from "./HeaderContainer";
import SummaryContainer from "./SummaryContainer";
import { DependencyData } from "../src/dataProcessing";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

export type PageProps = {
	JSObject: DependencyData;
	finalData: boolean;
};

type Filter = { type: "rank" | "time", level: any, direction: boolean }

function applyFilter(row: ProcessedDependencyData[0], filter: Filter): boolean {
	switch (filter.type) {
		case "rank":
			return filter.direction ? (row.minRank >= filter.level) : (row.minRank <= filter.level)
			break
		case "time":

			break
	}
	return true
}

export function Page(props: PageProps) {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [filterSetting, setFilterSetting] = useState<Filter>({ type: "rank", level: 0, direction: false });
	const [sortSetting, setSortSetting] = useState<{ type: "name" | "rank" | "time", direction: boolean }>({ type: "rank", direction: true });
	const rows = useProcessDependencyData(props.JSObject);
	const rankArray = { green: 0, red: 0, yellow: 0 };
	const diplayedRows = [];

	let loadingWheel: any = null;
	if (!props.finalData) {
		loadingWheel = (
			<Box
				sx={{
					display: "inline-block",
					float: "right",
					justifyContent: "center",
					alignItems: "center",
					width: "10vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	//Sorting. Doing this after filtering would be more efficient
	switch (sortSetting.type) {
		case ("name"):
			rows.sort((a, b) => a.name.localeCompare(b.name))
			break
		case ("rank"):
			//Sort by name first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			break
		case ("time"):
			//TODO
			//Sort by name first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			throw new Error("Time sorting is not yet implemented")
			break
	}

	if (!sortSetting.direction) { rows.reverse() }

	const jsxRows = rows.map((row) => (
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
	));

	for (let i = 0; i < rows.length; i++) {
		if (rows[i].minRank == 2) {
			rankArray.green += 1;
		}
		if (rows[i].minRank == 1) {
			rankArray.yellow += 1;
		}
		if (rows[i].minRank == 0) {
			rankArray.red += 1;
		}
	}

	for (let i = 0; i < rows.length; i++) {
		let row = rows[i];
		let jsx = jsxRows[i];

		if (
			applyFilter(row, filterSetting) && (
				searchTerm.length == 0 ||
				row.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
		) {
			diplayedRows.push(jsx);
		}
	}

	const handleSortChange = (event: SelectChangeEvent) => {
		setSortSetting({ type: event.target.value as any, direction: sortSetting.direction })
	}

	const handleSortDirectionChange = (event: SelectChangeEvent) => {
		setSortSetting({ type: sortSetting.type, direction: event.target.value == "ascending" })
	}

	const handleRankCutoffDirectionChange = (event: SelectChangeEvent) => {
		setFilterSetting({ type: filterSetting.type, level: filterSetting.level, direction: event.target.value == "ascending" })
	}

	const handleRankCutoffChange = (event: SelectChangeEvent) => {
		setFilterSetting({ type: "rank", level: event.target.value, direction: filterSetting.direction })
	}

	const sortBox = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
		<InputLabel>Sort by</InputLabel>
		<Select
			value={sortSetting.type}
			onChange={handleSortChange}
			label="Sort by"
		>
			<MenuItem value="">
				<em>None</em>
			</MenuItem>
			<MenuItem value={"name"}>Name</MenuItem>
			<MenuItem value={"rank"}>Rank</MenuItem>
			<MenuItem value={"time"}>Time</MenuItem>
		</Select>
	</FormControl>

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

	const rankCutoffBox = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
		<InputLabel>Rank cutoff</InputLabel>
		<Select
			value={filterSetting.level}
			onChange={handleRankCutoffChange}
			label="Rank cutoff"
		>
			<MenuItem value={2}>Green</MenuItem>
			<MenuItem value={1}>Yellow</MenuItem>
			<MenuItem value={0}>Red</MenuItem>
		</Select>
	</FormControl>

	const rankCutoffDirectionBox = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
	<InputLabel>Rank cutoff direction</InputLabel>
	<Select
		value={filterSetting.direction ? "ascending" : "descending"}
		onChange={handleRankCutoffDirectionChange}
		label="Rank cutoff direction"
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
					<HeaderContainer />
					<SummaryContainer rankArray={rankArray} loadingWheel={loadingWheel} />
					<div>{sortBox}{sortDirectionBox}{rankCutoffBox}{rankCutoffDirectionBox}</div>
					<DependenciesContainer
						JSObject={props.JSObject}
						rows={diplayedRows}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
				</Layout>
			</main>
		</div>
	);
}
