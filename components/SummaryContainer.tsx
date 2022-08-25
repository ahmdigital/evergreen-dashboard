import React, { useState } from "react";
import styles from "./SummaryContainer.module.css";
import sharedStyles from "./treeView.module.css";
import ReposOverviewTable from "./SummaryComponents/RepoOverviewTable/ReposOverviewTable";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "./LightStatus";

export default function SummaryContainer(props: {
  rankArray: any;
  loadingWheel: any;
}) {
  const totalRepos =
    props.rankArray.green + props.rankArray.yellow + props.rankArray.red;
  let overallPercent = Math.round((props.rankArray.green / totalRepos) * 100);

  // State for opening the helpLegend
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  return (
    <div className={`${styles.summaryStyle} ${sharedStyles.sectionContainer}`}>
      <h3 className={sharedStyles.h3ContainerStyle}>Summary </h3>
      <div className={styles.container}>
      <div className={`${styles.summaryOverall} ${styles.sharedCompProps}`}>
            <h3 className={styles.overallTitleStyle}>Overall</h3>
            <h2 className={styles.percentStyle} >{overallPercent}%</h2>
        </div>

        <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
          <div className={styles.summaryCompHeader}>
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
          </div>
          {openHelp && <HelpScreen closeHelp={setOpenHelp} />}
          <div>
            <div className={styles.summaryComponent2}>
              <ReposOverviewTable rankArray={props.rankArray} />
            </div>
          </div>
        </div>

        <div className={`${styles.loadingWheelBox} ${styles.sharedCompProps}`}>
          {props.loadingWheel}
        </div>
      </div>
    </div>
  );
}
