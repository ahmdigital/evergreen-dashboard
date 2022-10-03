import React, { useState, useEffect } from "react";
import { InverseSubRow } from "./ReposTableComponents/InverseSubRow";
import { SubRow } from "./ReposTableComponents/SubRow";
import { ProcessedDependencyData, useProcessDependencyData } from "../hooks/useProcessDependencyData";
import Row from "./ReposTableComponents/Row";
import Layout from "./Layout";
import Head from "next/head";
import DependenciesContainer from "./ReposTableComponents/DependenciesContainer";
import SummaryContainer from "./SummaryComponents/SummaryContainer";
import MobileSummaryContainer from "./MobileComponents/MobileSummaryContainer";
import { DependencyData } from "../src/dataProcessing";
import LoadingSnackbar from "./FeedbackComponents/LoadingSnackbar";
import HelpGuide from "./HelpComponents/HelpGuide";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { RankSelectionList, SortBox, SortSettings } from  "./ReposTableComponents/SortAndFilterDropdowns";
import { applySort, Filter, rankCounts, searchAndFilter } from "../src/sortingAndFiltering";
import { ThemeProvider } from "@mui/material/styles";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { theme } from './ReposTableComponents/SortAndFilterDropdowns'

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
	const rows = useProcessDependencyData(props.JSObject);
	const [sortSetting, setSortSetting] = useState<SortSettings>({ type: "rank", direction: true });
	const [filterSetting, setFilterSetting] = useState<Filter>({ type: "", level: 0, direction: false, mustHaveDependency: -1, showRed: true, showYellow: true, showGreen: true });

	// check if there are no rows
	let emptyRows = rows.length === 0;

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
	applySort(rows, sortSetting)

	const jsxRows = rowsToJSX(rows)
	const rankArray = rankCounts(rows)

	const {dataRows, diplayedRows} = searchAndFilter(rows, jsxRows, filterSetting, searchTerm)

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
		<FormControl fullWidth>
			<InputLabel id="sort-direction-select-label" sx={{ fontSize: '1.3em', transform: 'translate(10px, -15px)' }}>
				Sort Direction
			</InputLabel>
			<Select
				label="___________ Sort Direction" //DO NOT REMOVE UNDERSCORES, label is only used for layout, see here https://mui.com/material-ui/api/outlined-input/#props
				labelId="sort-direction-select-label"
				value={sortSetting.direction ? "ascending" : "descending"}
				onChange={handleSortDirectionChange}
				IconComponent={(props) =>
					<ArrowDropDownIcon {...props} fontSize='large' htmlColor="#000000" />
				}
			>
				<MenuItem value={"ascending"}>Ascending</MenuItem>
				<MenuItem value={"descending"}>Descending</MenuItem>
			</Select>
		</FormControl>
	</ThemeProvider>

	// Check if user is on Mobile Device
	const [isMobile, setMobile] = useState(window.innerWidth < 600);
	const updateMedia = () => {
		setMobile(window.innerWidth < 600);
	};
	useEffect(() => {
		window.addEventListener("resize", updateMedia);
		return () => window.removeEventListener("resize", updateMedia);
	});


	return (
		<div className="container">
			{isMobile ? (
				<div>
					<Head>
						<title>Evergreen dashboard</title>
					</Head>
					<main style={{ padding: 0 }}>
						<Layout>
							<MobileSummaryContainer rankArray={rankArray} loadingBackdrop={loadingSnackbar} rows={rows} filterTerm={filterSetting} setFilterTerm={setFilterSetting} />
							{/* <MobileDependenciesContainer /> */}
							<DependenciesContainer
								JSObject={props.JSObject}
								rows={diplayedRows}
								dataRows={dataRows}
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
			) : (
				<div>
					<Head>
						<title>Evergreen dashboard</title>
					</Head>
					<main style={{ padding: 0 }}>
						<Layout>
							<SummaryContainer rankArray={rankArray} loadingSnackbar={loadingSnackbar} rows={rows} filterTerm={filterSetting} setFilterTerm={setFilterSetting} />
							<DependenciesContainer
								JSObject={props.JSObject}
								rows={diplayedRows}
								dataRows={dataRows}
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
			)}
		</div>
	);
}
