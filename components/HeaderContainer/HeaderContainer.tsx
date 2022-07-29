import React from "react";
import styles from "./HeaderContainer.module.css";
import sharedStyles from "../treeView.module.css";
import org from "../../config.json";

export default function HeaderContainer() {
  return (
    <div className={`${styles.headerStyle} ${sharedStyles.sectionContainer}`}>
      <h2 className="h2NoMargins">Evergreen Dashboard</h2>
      <p className={styles.headerStyle}>
        Monitoring for <b>{org.targetOrganisation}</b> Github Organisation
      </p>
    </div>
  );
}
