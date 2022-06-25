import React, { useState } from "react";
import styles from "../components/treeView.module.css";
import Grid from "@mui/material/Grid";
import ReposOverviewTable from "../components/summary_components/ReposOverviewTable";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "./HelpScreen";

export default function SummaryContainer(props: { rankArray: any, loadingWheel: any }) {
  const totalRepos =
    props.rankArray.green + props.rankArray.yellow + props.rankArray.red;
  let overallPercent = Math.round((props.rankArray.green / totalRepos) * 100);

  // State for opening the helpLegend
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  return (
    <div className={`${styles.summaryStyle} ${styles.sectionContainer}`}>
      <h3 className={styles.h3ContainerStyle}>Summary </h3>
      {/* Use below if overall % is to be adjacent to summary otherwise delete or delete top if not using below */}
      <Grid container spacing={3} style={{ paddingRight: 20 }}>
        <Grid item xs={12} sm={4}>
          <div
            className={styles.summaryOverall}
            style={{ backgroundColor: "rgba(31, 162, 25, 0.8)"}}
          >
            <h3 className={styles.overallTtitleStyle}>Overall</h3>
            <h2 className={styles.percentStyle} >{overallPercent}%</h2>
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div className={styles.summaryComponent}>
              <h4 className={styles.summaryStyle}>Repos Overview</h4>
              <Image
                className={styles.helpBtn}
                width="30px"
                height="30px"
                alt="help"
                src={helpIcon}
                onClick={() => {
                  setOpenHelp(true);
                }} 
              />
              {openHelp && <HelpScreen closeHelp={setOpenHelp} />}
            <Grid item xs={8}>
              <div className={styles.summaryComponent2}>
                <ReposOverviewTable rankArray={props.rankArray} />
              </div>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div className={styles.loadingWheelBox}>{props.loadingWheel}</div>
        </Grid>
      </Grid>
    </div>
  );
}
