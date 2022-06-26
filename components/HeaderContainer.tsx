import React from "react";
import styles from "../components/treeView.module.css";
import org from "../config.json";

export default function HeaderContainer() {
  return (
    <div className={`${styles.headerStyle} ${styles.sectionContainer}`}>
      <h2 className={styles.headerStyle}>Evergreen Dashboard</h2>
      <p className={styles.headerStyle}>
        Monitoring for <b>{org.targetOrganisation}</b> Github Organisation
      </p>
    </div>
  );
}
