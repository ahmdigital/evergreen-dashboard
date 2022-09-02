import React, { useState } from "react";
import styles from "./SummaryContainer.module.css";
import sharedStyles from "./treeView.module.css";
import ReposOverviewTable from "./SummaryComponents/RepoOverviewTable/ReposOverviewTable";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "./HelpScreen";
import headerStyles from "./HeaderContainer.module.css";
import org from "../config.json";

export default function SummaryContainer(props: {
  rankArray: any;
  loadingBackdrop: any;
}) {
  // Boolean value to determine whether to grey out
  let overallNan = false;

  const totalRepos =
    props.rankArray.green + props.rankArray.yellow + props.rankArray.red;
  let overallPercent = Math.round((props.rankArray.green / totalRepos) * 100);
  let overallPercentStr = overallPercent + "%"

  if(isNaN(overallPercent)){
    overallPercentStr = "N/A"
    overallNan = true;
  }

  // State for opening the helpLegend
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  return (
    <div className={`${styles.summaryStyle} ${sharedStyles.sectionContainer}`}>
        <h2 className="h2NoMargins">Evergreen Dashboard</h2>
        <p className={headerStyles.headerStyle}>
          Monitoring for <b>{org.targetOrganisation}</b> Github Organisation
        </p>
        <div>
            {props.loadingBackdrop}
        </div>
      <div className={styles.container}>
      <div className={`${overallNan == false ? styles.summaryOverall : styles.summaryOverallGrey} ${styles.sharedCompProps} ${styles.summaryOverall}`}>
            <h3 className={styles.overallTitleStyle}>Overall</h3>
            <h2 className={styles.percentStyle} >{overallPercentStr}</h2>
        </div>

        <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
          <div className={styles.summaryCompHeader}>

          <h3>{`Total Repos (${props.rankArray.green + props.rankArray.yellow + props.rankArray.red})`}</h3>
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
        <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
          <div className={styles.summaryCompHeader}>
            <h4 className={styles.summaryStyle}>Dependent Repos</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
