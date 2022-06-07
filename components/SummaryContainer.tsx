import React from "react";
import styles from "../components/treeView.module.css";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import ReposOverviewTable from "../components/summary_components/ReposOverviewTable";
import UrgentRepos from "../components/summary_components/UrgentRepos";

export default function SummaryContainer() {
    return (
        <div className={`${styles.summaryStyle} ${styles.sectionContainer}`}>
            <h3 className={styles.h3ContainerStyle}>Summary </h3> 
            {/* Use below if overall % is to be adjacent to summary otherwise delete or delete top if not using below */}
            <Grid container spacing={3} style={{ paddingRight: 20}}>
                <Grid item xs={12} sm={4}>
                    <div className={styles.percentComponent}>
                        <h2 className={styles.percentStyle}>Overall %</h2>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div className={styles.summaryComponent}>
                        <h3 className={styles.summaryStyle}>Repos Overview</h3>
                        <ReposOverviewTable/>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div className={styles.summaryComponent}>
                        <h3 className={styles.summaryStyle}>Urgent Repos</h3>
                        <UrgentRepos/>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}