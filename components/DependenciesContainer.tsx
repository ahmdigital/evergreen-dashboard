import React from "react";
import CollapsibleTable from "./CollapsibleTable";
import styles from "./DependenciesContainer.module.css";
import sharedStyles from "./treeView.module.css";
import SearchBar from "./SearchBar";
import { DependencyData } from "../src/dataProcessing";
import config from "../config.json";

/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(props: {
  JSObject: DependencyData;
  tableRows: any;
  setTableRows: any;
  searchTerm: any;
  setSearchTerm: any;
  sortDropdown: any;
  rankSelection: any;
  emptyRows: boolean;
  sortDirection: any;
}) {


  return (
    <div className={`${styles.sectionContainer}`}>
      <h3 className={sharedStyles.h3ContainerStyle}>Repositories </h3>

      <div className={styles.depsBarStyle}>

        <SearchBar
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
          repoNames={(props.tableRows.map(row => row.name))}
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
        <CollapsibleTable tableRows={props.tableRows} setTableRows={props.setTableRows} searchTerm={props.searchTerm} setSearchTerm={props.setSearchTerm}></CollapsibleTable>
      </div>
      {
        props.emptyRows &&
        <div className={styles.noReposStyle}>
          <p><b>{config.targetOrganisation}</b> has 0 repositories</p>
        </div>
      }
      {
        !props.emptyRows && (props.searchTerm !== "" && props.tableRows.length === 0) &&
        <div className={styles.noReposStyle}>
          <p>No search results found</p>
        </div>
      }
    </div>
  );
}
