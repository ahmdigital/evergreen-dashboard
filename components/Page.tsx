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
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";

export type PageProps = {
	JSObject: DependencyData;
	finalData: boolean;
};

type Filter = { type: "" | "time", level: any, direction: boolean, showRed: boolean, showYellow: boolean, showGreen: boolean }

function applyFilter(row: ProcessedDependencyData[0], filter: Filter): boolean {
	switch (row.minRank) {
		case 0: if (!filter.showRed) { return false } break
		case 1: if (!filter.showYellow) { return false } break
		case 2: if (!filter.showGreen) { return false } break
	}
	switch (filter.type) {
		//case "rank":
		//return filter.direction ? (row.minRank >= filter.level) : (row.minRank <= filter.level)
		//break
		case "time":

			break
	}
	return true
}

export function Page(props: PageProps) {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [filterSetting, setFilterSetting] = useState<Filter>({ type: "", level: 0, direction: false, showRed: true, showYellow: true, showGreen: true });
	const [sortSetting, setSortSetting] = useState<{ type: "name" | "rank" | "time" | "internal" | "external" | "total" | "users", direction: boolean }>({ type: "rank", direction: true });
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
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => dayjs(b.lastUpdated).diff(dayjs(a.lastUpdated)))
			break
		case ("internal"):
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => a.internalSubRows.length - b.internalSubRows.length)
			break
		case ("external"):
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => a.externalSubRows.length - b.externalSubRows.length)
			break
		case ("total"):
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => ( a.internalSubRows.length + a.externalSubRows.length) - (b.internalSubRows.length + b.externalSubRows.length))
			break
		case ("users"):
			//Sort by name and rank first
			rows.sort((a, b) => a.name.localeCompare(b.name))
			rows.sort((a, b) => a.minRank - b.minRank)
			rows.sort((a, b) => a.userSubRows.length - b.userSubRows.length)
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

	const handleFilterCutoffDirectionChange = (event: SelectChangeEvent) => {
		setFilterSetting({ ...filterSetting, direction: event.target.value == "ascending" })
	}

	const handleFilterChange = (event: SelectChangeEvent) => {
		const sel = event.target.value;
		if (sel in ["", "time"]) {
			setFilterSetting({ ...filterSetting, type: sel as "" | "time" })
		}
	}

	const handleRankSelectionChange = (event: SelectChangeEvent<string[]>) => {
		const sel = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
		setFilterSetting({ ...filterSetting, showRed: sel.indexOf("red") != -1, showYellow: sel.includes("yellow"), showGreen: sel.includes("green") })
	};

	const sortBox = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
		<InputLabel>Sort by</InputLabel>
		<Select
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

	const rankSelectionValue = [
		...(filterSetting.showGreen ? ["green"] : []),
		...(filterSetting.showYellow ? ["yellow"] : []),
		...(filterSetting.showRed ? ["red"] : [])
	]

	const rankSelectionList = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
		<InputLabel>Rank filter</InputLabel>
		<Select
			multiple
			value={rankSelectionValue}
			onChange={handleRankSelectionChange}
			renderValue={(selected) => selected.join(', ')}
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

	const rankCutoffBox = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
		<InputLabel>Filters</InputLabel>
		<Select
			value={filterSetting.type}
			onChange={handleFilterChange}
			label="Filters"
		>
			<MenuItem value=""> <em>None</em> </MenuItem>
		</Select>
	</FormControl>

	const filterCutoffDirectionBox = <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
		<InputLabel>Rank cutoff direction</InputLabel>
		<Select
			value={filterSetting.direction ? "ascending" : "descending"}
			onChange={handleFilterCutoffDirectionChange}
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
					<div>{sortBox}{sortDirectionBox}{rankSelectionList}{rankCutoffBox}{filterCutoffDirectionBox}</div>
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
