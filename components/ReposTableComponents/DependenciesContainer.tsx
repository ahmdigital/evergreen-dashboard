import React from "react";
import styles from "../../styles/DependenciesContainer.module.css";
import sharedStyles from "../../styles/TreeView.module.css";
import SearchBar from "./SearchBar";
import { DependencyData } from "../../src/dataProcessing";
import { Filter } from "../../src/sortingAndFiltering";
import { ProcessedDependencyData } from "../../hooks/useProcessDependencyData";
import { GridTable } from "../MobileComponents/GridTable";
import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Grid, IconButton } from "@mui/material";

/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(props: {
	JSObject: DependencyData;
	tableRows: ProcessedDependencyData;
	setTableRows: React.Dispatch<React.SetStateAction<ProcessedDependencyData>>	;
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	sortDropdown: JSX.Element;
	rankSelection: JSX.Element;
	emptyRows: boolean;
	sortDirection: JSX.Element;
	filterSetting: Filter;
	targetOrganisation: string;
	finalisedData: ProcessedDependencyData;
}) {
	const [filterOpen, setFilterOpen] = React.useState(false);

	const toggleFilter = () => {
		setFilterOpen(!filterOpen);
	};

	const filterSelectGridDisplay = {
		display: {
			xs: filterOpen ? "block" : "none",
			md: 'initial'
		}
	};

	return (
		<Box className={styles.sectionContainer} sx={{
			padding: {
				xs: 2,
				md: '2.5rem 3.125rem 3.75rem 3.125rem',
			}
		}}>
			<h2 className={sharedStyles.h2ContainerStyle}>Repositories </h2>

			<Grid container spacing={2}>
				<Grid item xs={12} lg={5} xl={6}>
				<Grid container  spacing={1} alignItems="center">
					<Grid item xs>

						<SearchBar
								searchTerm={props.searchTerm}
								setSearchTerm={props.setSearchTerm}
								repoNames={(props.tableRows.map((row) => row.name))}
								/>
					</Grid>

					<Grid item xs="auto">
							<IconButton
								sx={{ display: { xs: 'initial', md: 'none' } }}
								aria-label='Sort and filter'
								onClick={toggleFilter}
								>
								<FilterListIcon
									fontSize='medium'
									color={filterOpen ? 'primary' : 'inherit'}
									/>
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={4} lg={2.33} xl={2} sx={filterSelectGridDisplay}>
					{props.sortDropdown}
				</Grid>
				<Grid item xs={12} md={4} lg={2.33} xl={2} sx={filterSelectGridDisplay}>
					{props.sortDirection}
				</Grid>
				<Grid item xs={12} md={4} lg={2.33} xl={2} sx={filterSelectGridDisplay}>
					{props.rankSelection}
				</Grid>
			</Grid>

			<GridTable rows={props.finalisedData} emptyRows={props.emptyRows} searchTerm={props.searchTerm} tableRows={props.tableRows}/>

			{/* TODO: Delete this */}
			{/* <div className={styles.tableStyle}>
				<CollapsibleTable tableRows={props.tableRows} setTableRows={props.setTableRows} searchAndFilteredData={searchAndFilteredData}></CollapsibleTable>
			</div> */}
		</Box>
	);
}
