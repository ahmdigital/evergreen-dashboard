import React from "react";
import CollapsibleTable from "./CollapsibleTable";
import styles from "./DependenciesContainer.module.css";
import sharedStyles from "./treeView.module.css";
import SearchBar from "./SearchBar";
import { DependencyData } from "../src/dataProcessing";
import config from "../config.json";
import { Grid } from "@mui/material"
//import filterIcon from "../components/images/filter.svg" ;
import {
  PageLoaderCurrentData,
  forceNewVersion,
  PageLoaderIsLoading,
  lastRequest,
  PageLoaderSetData,
  PageLoaderSetLoading,
} from "./PageLoader";

let refreshing = false;

/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(props: {
  JSObject: DependencyData;
  rows: JSX.Element[];
  searchTerm: any;
  setSearchTerm: any;
  emptyRows: boolean;
  sortDropdown: any;
  rankSelection: any;
  sortDirection: any;
}) {
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

  return (
    <div className={`${styles.sectionContainer}`}>
      <h3 className={sharedStyles.h3ContainerStyle}>Repositories </h3>
    
      <Grid container spacing={0}>

        <Grid xs={12} lg={6} item>
          <Grid container alignItems='center'>
            <SearchBar
              searchTerm={props.searchTerm}
              setSearchTerm={props.setSearchTerm}
            />
          </Grid>
        </Grid>

        <Grid xs={12} md={4} lg={2} item >
          <Grid container alignItems='center'>
            {props.sortDropdown}
          </Grid>
        </Grid>

        <Grid xs={12} md={4} lg={2} item >
          <Grid container alignItems='center'>
            {props.sortDirection}
          </Grid>
        </Grid>

        <Grid xs={12} md={4} lg={2} item >
          <Grid container alignItems='center'>
            {props.rankSelection}
          </Grid>
        </Grid>

      </Grid>


      <div className={styles.tableStyle}>
        <CollapsibleTable>{props.rows}</CollapsibleTable>
      </div>
      {
        props.emptyRows &&
        <div className={styles.noReposStyle}>
          <p><b>{config.targetOrganisation}</b> has 0 repositories</p>
        </div>
      }
      {
        !props.emptyRows && (props.searchTerm !== "" && props.rows.length === 0) &&
        <div className={styles.noReposStyle}>
          <p>No search results found</p>
        </div>
      }
    </div>
  );
}
