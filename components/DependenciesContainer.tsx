import React, { ReactNode } from "react";
import CollapsibleTable from "./CollapsibleTable";
import styles from "./DependenciesContainer.module.css";
import sharedStyles from "./treeView.module.css";
import SearchBar from "./SearchBar";
import { DependencyData } from "../src/dataProcessing";
import refreshIcon from "../components/images/refresh.svg" ;
//import filterIcon from "../components/images/filter.svg" ;
import Image from "next/image";
import { PageLoaderCurrentData, forceNewVersion, PageLoaderIsLoading, lastRequest, PageLoaderSetData, PageLoaderSetLoading } from "./PageLoader";

let refreshing = false

/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(props: {
  JSObject: DependencyData;
  rows: ReactNode;
  searchTerm: any;
  setSearchTerm: any;
  sortDropdown: any;
  rankSelection: any;
}) {

	async function callRefresh(){
		if(refreshing){ return }
		if(lastRequest == null){ return; }
		if(PageLoaderIsLoading){ return; }
		PageLoaderSetLoading(true)
		PageLoaderSetData({refreshing: true, data: PageLoaderCurrentData as any} as any)

		refreshing = true

		//TODO: Support other configuration
		//switch(mode){
		//	case(Mode.Frontend): break;
		//	case(Mode.StandaloneBackend):break;
		//	case(Mode.IntegratedBackend): {
				forceNewVersion(lastRequest).then(async (result) => {
					PageLoaderSetData(result as any)
					PageLoaderSetLoading(false)
					refreshing = false
				})
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
      {/* commented out filter button */}
        <div className={styles.btnsContainer}>
		  {props.sortDropdown}
		  {props.rankSelection}
          {/* <button>
            <Image src={filterIcon} alt="filter" width="20px" height="20px"></Image>
            <span>Filter</span>
          </button> */}
          <button onClick={callRefresh}>
            <Image src={refreshIcon} alt="refresh" width="20rem" height="20rem"></Image>
            <span className={styles.refreshWord}>Refresh</span>
          </button>
        </div>
      </div>
      <div className={styles.tableStyle}>
        <CollapsibleTable>{props.rows}</CollapsibleTable>
      </div>
    </div>
  );
}
