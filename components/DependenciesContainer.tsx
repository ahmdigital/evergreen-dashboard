import React from "react";
import makeCollapsibleTable from "./CollapsibleTable";
import Container from '@mui/material/Container';
import { PageProps } from "./Page";
import styles from "../components/treeView.module.css";
// import { style } from "@mui/system";
/* Container includes  Search, Filter, Dependencies Table */
export default function DependenciesContainer(props: PageProps) {
    return (
            <div className={`${styles.dependenciesStyle} ${styles.sectionContainer}`}>
                <h3 className={styles.h3ContainerStyle}>Dependencies </h3> 
                {makeCollapsibleTable(props.JSObject)}
                
            </div>
            

    );
} 



