import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
	ProcessedDependencyData,
	useProcessDependencyData,
} from "../hooks/useProcessDependencyData";
import Layout from "./Layout";
import DependenciesContainer from "./ReposTableComponents/DependenciesContainer";
import SummaryContainer from "./SummaryComponents/SummaryContainer";
import MobileSummaryContainer from "./MobileComponents/MobileSummaryContainer";
import { DependencyData } from "../src/dataProcessing";
import LoadingSnackbar from "./FeedbackComponents/LoadingSnackbar";
import HelpGuide from "./HelpComponents/HelpGuide";
import {
	RankSelectionList,
	SortBox,
	SortSettings,
} from "./ReposTableComponents/SortAndFilterDropdowns";
import {
	applyFilter,
	applySort,
	Filter,
	rankCounts,
} from "../src/sortingAndFiltering";

export type PageProps = {
	JSObject: DependencyData;
	finalData: boolean;
	targetOrganisation: string;
};

export type RankArray = {
	green: number;
	red: number;
	yellow: number;
};

// Customising the table styling using ThemeProvider
const theme2 = createTheme({
	components: {
		MuiSelect: {
			styleOverrides: {
				select: {
					fontSize: "1rem",
					fontFamily: "var(--primary-font-family)",
					color: "black",
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					fontSize: "1.1rem",
					fontFamily: "var(--primary-font-family)",
					color: "black",
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					fontSize: "1.1rem",
					fontFamily: "var(--primary-font-family)",
					color: "black",
				},
			},
		},
	},
});

export function Page(props: PageProps) {
	// Using react state for table data
	const rows = useProcessDependencyData(props.JSObject);
	const [tableRows, setTableRows] = useState<ProcessedDependencyData>(
		useProcessDependencyData(props.JSObject)
	);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortSetting, setSortSetting] = useState<SortSettings>({
		type: "rank",
		direction: true,
	});
	const [filterSetting, setFilterSetting] = useState<Filter>({
		type: "",
		level: 0,
		direction: false,
		mustHaveDependency: -1,
		showRed: true,
		showYellow: true,
		showGreen: true,
	});

	// check if there are no rows
	let emptyRows = tableRows.length === 0;

	let loadingSnackbar: any = null;
	// If the final data is loading, then set the backdrop open to true
	if (!props.finalData) {
		loadingSnackbar = (
			<>
				<LoadingSnackbar open={true} />
			</>
		);
	}

	// //Sorting. Doing this after filtering would be more efficient
	// applySort(tableRows, sortSetting)

	const rankArray: RankArray = rankCounts(tableRows);

	const sortBox = SortBox(sortSetting, (event: SelectChangeEvent) => {
		setSortSetting({
			type: event.target.value as any,
			direction: sortSetting.direction,
		});
	});

	const rankSelectionList = RankSelectionList(
		filterSetting,
		(event: SelectChangeEvent<string[]>) => {
			const sel =
				typeof event.target.value === "string"
					? event.target.value.split(",")
					: event.target.value;
			setFilterSetting({
				...filterSetting,
				showRed: sel.indexOf("Highly-Outdated") != -1,
				showYellow: sel.includes("Moderately-Outdated"),
				showGreen: sel.includes("Up-To-Date"),
			});
		}
	);

	//TODO: Adapt to sorting buttons
	const handleSortDirectionChange = (event: SelectChangeEvent) => {
		setSortSetting({
			type: sortSetting.type,
			direction: event.target.value == "ascending",
		});
	};

	//TODO: Replace this
	const sortDirectionBox = (
		<ThemeProvider theme={theme2}>
			<FormControl fullWidth>
				<InputLabel
					id="sort-direction-select-label"
					sx={{
						fontSize: "1.3em",
						transform: "translate(10px, -15px)",
					}}
				>
					Sort Direction
				</InputLabel>
				<Select
					label="___________ Sort Direction" //DO NOT REMOVE UNDERSCORES, label is only used for layout, see here https://mui.com/material-ui/api/outlined-input/#props
					labelId="sort-direction-select-label"
					value={sortSetting.direction ? "ascending" : "descending"}
					onChange={handleSortDirectionChange}
					IconComponent={(props) => (
						<ArrowDropDownIcon
							{...props}
							fontSize="large"
							htmlColor="#000000"
						/>
					)}
				>
					<MenuItem value={"ascending"}>Ascending</MenuItem>
					<MenuItem value={"descending"}>Descending</MenuItem>
				</Select>
			</FormControl>
		</ThemeProvider>
	);

	// Check if user is on Mobile Device
	const [isMobile, setMobile] = useState(window.innerWidth < 600);
	const updateMedia = () => {
		setMobile(window.innerWidth < 600);
	};
	useEffect(() => {
		window.addEventListener("resize", updateMedia);
		return () => window.removeEventListener("resize", updateMedia);
	});

	// Apply the search, sorting and filtering before passing the data to other components
	const finalisedData = useMemo(() => {
		return tableRows.filter(
			(row) =>
				applyFilter(row, filterSetting) &&
				row.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [tableRows, filterSetting, searchTerm]);
	applySort(finalisedData, sortSetting);

	return (
		<>
			{isMobile ? (
				<>
					<Head>
						<title>Evergreen dashboard</title>
					</Head>
					<div style={{ padding: 0 }}>
						<Layout>
							<MobileSummaryContainer
								auxData={props.JSObject.aux}
								rankArray={rankArray}
								loadingSnackbar={loadingSnackbar}
								rows={rows}
								filterTerm={filterSetting}
								setFilterTerm={setFilterSetting}
								targetOrganisation={props.targetOrganisation}
							/>
							{/* <MobileDependenciesContainer /> */}
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
								filterSetting={filterSetting}
								targetOrganisation={props.targetOrganisation}
								finalisedData={finalisedData}
							/>
							<HelpGuide />
						</Layout>
					</div>
				</>
			) : (
				<>
					<Head>
						<title>Evergreen dashboard</title>
					</Head>
					<div style={{ padding: 0 }}>
						<Layout>
							<SummaryContainer
								auxData={props.JSObject.aux}
								rankArray={rankArray}
								loadingSnackbar={loadingSnackbar}
								rows={rows}
								filterTerm={filterSetting}
								setFilterTerm={setFilterSetting}
								targetOrganisation={props.targetOrganisation}
							/>
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
								filterSetting={filterSetting}
								targetOrganisation={props.targetOrganisation}
								finalisedData={finalisedData}
							/>
							<HelpGuide />
						</Layout>
					</div>
				</>
			)}
		</>
	);
}
