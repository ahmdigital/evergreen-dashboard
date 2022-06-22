import React, { ReactNode } from "react";
import CollapsibleTable from "./CollapsibleTable";
import { PageProps } from "./Page";
import styles from "../components/treeView.module.css";
import SearchBar from "./SearchBar";
import { useProcessDependencyData } from "../hooks/useProcessDependencyData";
import { DependencyData } from "../src/dataProcessing";

/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(props: {
  JSObject: DependencyData;
  rows: ReactNode;
  searchTerm: any;
  setSearchTerm: any;
}) {
  return (
    <div className={`${styles.dependenciesStyle} ${styles.sectionContainer}`}>
      <h3 className={styles.h3ContainerStyle}>Dependencies </h3>
      <SearchBar
        searchTerm={props.searchTerm}
        setSearchTerm={props.setSearchTerm}
      />

      <div className={styles.barStyle}>
        <CollapsibleTable>{props.rows}</CollapsibleTable>
      </div>
    </div>
  );
}
