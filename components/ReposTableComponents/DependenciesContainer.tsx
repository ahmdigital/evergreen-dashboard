import React from "react";
import CollapsibleTable from "./CollapsibleTable";
import styles from "../../styles/DependenciesContainer.module.css";
import sharedStyles from "../../styles/TreeView.module.css";
import SearchBar from "./SearchBar";
import { DependencyData } from "../../src/dataProcessing";
import getConfig from 'next/config'
const { publicRuntimeConfig: config } = getConfig();

import {
  PageLoaderCurrentData,
  forceNewVersion,
  PageLoaderIsLoading,
  lastRequest,
  PageLoaderSetData,
  PageLoaderSetLoading,
} from "../PageLoader";

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

  return (
    <div className={`${styles.sectionContainer}`}>
      <h3 className={sharedStyles.h3ContainerStyle}>Repositories </h3>

      <div className={styles.depsBarStyle}>

        <SearchBar
          searchTerm={ContainerProps.searchTerm}
          setSearchTerm={ContainerProps.setSearchTerm}
        />

        <div className={styles.menuStyle}>
          {ContainerProps.sortDropdown}
        </div>

        <div className={styles.menuStyle}>
          {ContainerProps.sortDirection}
        </div>

        <div className={styles.menuStyle}>
          {ContainerProps.rankSelection}
        </div>

      </div>


      <div className={styles.tableStyle}>
        <CollapsibleTable>{ContainerProps.rows}</CollapsibleTable>
      </div>
      {
        ContainerProps.emptyRows &&
        <div className={styles.noReposStyle}>
          <p>
            <b>{props.targetOrganisation}</b> has 0 repositories
          </p>
        </div>
      }
      {
        !ContainerProps.emptyRows && (ContainerProps.searchTerm !== "" && ContainerProps.rows.length === 0) &&
        <div className={styles.noReposStyle}>
          <p>No search results found</p>
        </div>
      }
    </div>
  );
}
