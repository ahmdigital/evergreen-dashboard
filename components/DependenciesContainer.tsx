import React, { ReactNode } from "react";
import CollapsibleTable from "./CollapsibleTable";
import styles from "./DependenciesContainer.module.css";
import SearchBar from "./SearchBar";
import { DependencyData } from "../src/dataProcessing";
// import refreshIcon from "../components/images/refresh.svg" ;
// import filterIcon from "../components/images/filter.svg" ;
// import Image from "next/image";

/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(props: {
  JSObject: DependencyData;
  rows: ReactNode;
  searchTerm: any;
  setSearchTerm: any;
}) {

  return (
    <div className={`${styles.sectionContainer}`}>
      <h3 className={styles.h3ContainerStyle}>Repositories </h3>
      <div className={styles.depsBarStyle}>
        <div style={{width:"70%", minWidth: "25rem"}}>
        <SearchBar
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
        />
        </div>
        {/* <div className={styles.btnsContainer}>
          <button>
            <Image src={filterIcon} alt="filter" width="20px" height="20px"></Image>
            <span>Filter</span>
          </button>
          <button>
          <Image src={refreshIcon} alt="refresh" width="20px" height="20px"></Image>
          <span>Refresh</span>
          </button>
        </div> */}
      </div>
      <div className={styles.tableStyle}>
        <CollapsibleTable>{props.rows}</CollapsibleTable>
      </div>

    </div>
  );
}
