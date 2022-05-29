import React from "react";
import styles from "../components/treeView.module.css";

export default function SummaryContainer() {
    return (
        <div className={`${styles.summaryStyle} ${styles.sectionContainer}`}>
            <h3 className={styles.h3ContainerStyle}>Summary </h3> 
            {/* Use below if overall % is to be adjacent to summary otherwise delete or delete top if not using below */}
            <div className={styles.summaryHeader}> 
                <h3 className={styles.summaryStyle}>Summary </h3> 
            </div>
            
        </div>
    )
}