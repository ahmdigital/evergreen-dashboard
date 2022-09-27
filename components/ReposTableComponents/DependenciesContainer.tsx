import React from "react";
import CollapsibleTable from "./CollapsibleTable";
import styles from "../../styles/DependenciesContainer.module.css";
import sharedStyles from "../../styles/TreeView.module.css";
import SearchBar from "./SearchBar";
import { DependencyData } from "../../src/dataProcessing";
import config from "../../config.json";
// import { Grid } from "@mui/material"
//import filterIcon from "../components/images/filter.svg" ;
import {
  PageLoaderCurrentData,
  forceNewVersion,
  PageLoaderIsLoading,
  lastRequest,
  PageLoaderSetData,
  PageLoaderSetLoading,
} from "../PageLoader";

let refreshing = false;

/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(props: {
  JSObject: DependencyData;
  rows: JSX.Element[];
  searchTerm: any;
  setSearchTerm: any;
  sortDropdown: any;
  rankSelection: any;
  emptyRows: boolean;
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

      <div className={styles.depsBarStyle}>

        <SearchBar
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
        />

        <div className={styles.menuStyle}>
          {props.sortDropdown}
        </div>

        <div className={styles.menuStyle}>
          {props.sortDirection}
        </div>

        <div className={styles.menuStyle}>
          {props.rankSelection}
        </div>
        
      </div>


      <div className={styles.tableStyle}>
        <CollapsibleTable>{props.rows}</CollapsibleTable>
      </div>
      {
        props.emptyRows &&
        <div className={styles.noReposStyle}>
          <p>
            <b>{process.env.NEXT_PUBLIC_TARGET_ORGANISATION}</b> has 0 repositories
          </p>
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
