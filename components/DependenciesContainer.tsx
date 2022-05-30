import React from "react";
import makeCollapsibleTable from "./CollapsibleTable";
import { PageProps } from "./Page";
import styles from "../components/treeView.module.css";
import SearchBar from "./SearchBar";
/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(props: PageProps) {
    return (
            <div className={`${styles.dependenciesStyle} ${styles.sectionContainer}`}>
                <h3 className={styles.h3ContainerStyle}>Dependencies </h3> 
                <SearchBar />
                {makeCollapsibleTable(props.JSObject)}
                
            </div>           
    );
} 



