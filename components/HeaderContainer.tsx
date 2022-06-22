import React from "react";
import styles from "../components/treeView.module.css";

export default function HeaderContainer() {
    return (
        <div className={`${styles.headerStyle} ${styles.sectionContainer}`}>
            <h2 className={styles.headerStyle}>
              Evergreen Dashboard
            </h2>
            <p className={styles.headerStyle}>Monitoring for {"[User's Github Organisation]"}</p>
        </div>
        
    )
}

{/* <div className={styles.topBarStyle}>
<h1
  className="title"
  style={{
    padding: "0 32px",
    fontWeight: 600,
    color: "var(--colour-font)",
  }}
>
  Evergreen Dashboard
</h1> */}