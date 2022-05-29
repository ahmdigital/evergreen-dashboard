import React, { useState } from "react";
import makeCollapsibleTable from "./CollapsibleTable";
import Container from '@mui/material/Container';
import { DependencyData } from "./dataProcessing";
import { PageProps } from "./Page";
import styles from "../components/treeView.module.css";

export default function DependenciesContainer(props: PageProps) {
    return (
        <Container maxWidth="sm">
            {/* Container includes  Search, Filter, Dependencies Table */}
            <div className={styles.barStyle}>
                {" "}
                {makeCollapsibleTable(props.JSObject)}{" "}
            </div>
        </Container>
    );
}



