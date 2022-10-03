import React from "react";
import styles from "../../styles/DependenciesContainer.module.css";
import sharedStyles from "../../styles/TreeView.module.css";
import SearchBar from "./SearchBar";
import { DependencyData } from "../../src/dataProcessing";
import getConfig from 'next/config'
import FilterListIcon from '@mui/icons-material/FilterList';
const { publicRuntimeConfig: config } = getConfig();

import {
	PageLoaderCurrentData,
	forceNewVersion,
	PageLoaderIsLoading,
	lastRequest,
	PageLoaderSetData,
	PageLoaderSetLoading,
} from "../PageLoader";
import { Box, Grid, IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import { GridTable } from "../MobileComponents/GridTable";
import { ProcessedDependencyData } from "../../hooks/useProcessDependencyData";

let refreshing = false;


export async function getServerSideProps() {
  return {
    props: {
      targetOrganisation: process.env.NEXT_PUBLIC_TARGET_ORGANISATION,
    }
  }
}

/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(ContainerProps: {
  JSObject: DependencyData;
  rows: JSX.Element[];
  dataRows: ProcessedDependencyData;
  searchTerm: any;
  setSearchTerm: any;
  sortDropdown: any;
  rankSelection: any;
  emptyRows: boolean;
  sortDirection: any;
}, props: { targetOrganisation: string }) {
  async function callRefresh() {
    if (refreshing) {
      return;
    }
    if (lastRequest == null) {
      return;
    }
    if (PageLoaderIsLoading) {
      return;
    }
    PageLoaderSetLoading(true);
    PageLoaderSetData({
      refreshing: true,
      data: PageLoaderCurrentData as any,
    } as any);

		refreshing = true;

		//TODO: Support other configuration
		//switch(mode){
		//	case(Mode.Frontend): break;
		//	case(Mode.StandaloneBackend):break;
		//	case(Mode.IntegratedBackend): {
		forceNewVersion(lastRequest).then(async (result) => {
			PageLoaderSetData(result as any);
			PageLoaderSetLoading(false);
			refreshing = false;
		});
		//	} break;
		//}
	}

	const [filterOpen, setFilterOpen] = React.useState(false);

	const toggleFilter = () => {
		setFilterOpen(!filterOpen);
	};

	const filterSelectGridDisplay = {
		display: {
			xs: filterOpen ? "block" : "none",
			md: 'initial'
		}
	}

	return (
		<Box className={styles.sectionContainer} sx={{
			padding: {
				xs: 2,
				md: '2.5rem 3.125rem 3.75rem 3.125rem',
			}
		}}>
			<h3 className={sharedStyles.h3ContainerStyle}>Repositories </h3>

			<Grid container spacing={2}>
				<Grid item xs={12} lg={5} xl={6}>
					<Stack direction="row" spacing={1} alignItems="center">
					<SearchBar
          				searchTerm={ContainerProps.searchTerm}
          				setSearchTerm={ContainerProps.setSearchTerm}
        			/>
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
					</Stack>
				</Grid>
				<Grid item xs={12} md={4} lg={2.33} xl={2} sx={filterSelectGridDisplay}>
					{ContainerProps.sortDropdown}
				</Grid>
				<Grid item xs={12} md={4} lg={2.33} xl={2} sx={filterSelectGridDisplay}>
					{ContainerProps.sortDirection}
				</Grid>
				<Grid item xs={12} md={4} lg={2.33} xl={2} sx={filterSelectGridDisplay}>
					{ContainerProps.rankSelection}
				</Grid>
			</Grid>
			
			<GridTable rows={ContainerProps.dataRows} />

			{
				ContainerProps.emptyRows &&
				<div className={styles.noReposStyle}>
					<p>
						<b>{config.targetOrganisation}</b> has 0 repositories
					</p>
				</div>
			}
			{
				!ContainerProps.emptyRows && (ContainerProps.searchTerm !== "" && ContainerProps.rows.length === 0) &&
				<div className={styles.noReposStyle}>
					<p>No search results found</p>
				</div>
			}
		</Box>
	);
}
