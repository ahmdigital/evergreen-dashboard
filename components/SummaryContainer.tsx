import React, { useState } from "react";
import styles from "./SummaryContainer.module.css";
import sharedStyles from "./treeView.module.css";
import ReposOverviewTable from "./SummaryComponents/RepoOverviewTable/ReposOverviewTable";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "./HelpScreen";
import headerStyles from "./HeaderContainer.module.css";
import config from "../config.json";

export default function SummaryContainer(props: {
  rankArray: any;
  loadingBackdrop: any;
}) {
  const totalRepos = props.rankArray.green + props.rankArray.yellow + props.rankArray.red;
  let overallPercent = Math.round((props.rankArray.green / totalRepos) * 100);
  let overallPercentStr = overallPercent + "%"
  let overallStyle = styles.summaryOverall
  let overallColour = styles.summaryOverallGreen

  if(isNaN(overallPercent)){
    overallPercentStr = "N/A"
	overallColour = styles.summaryOverallGrey
  } else if(overallPercent < config.targetPercentage){
	overallColour = styles.summaryOverallRed
  }

  // State for opening the helpLegend
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  return (
    <div className={`${styles.summaryStyle} ${sharedStyles.sectionContainer}`}>
        <h2 className="h2NoMargins">Evergreen Dashboard</h2>
        <p className={headerStyles.headerStyle}>
          Monitoring for <b>{config.targetOrganisation}</b> Github Organisation
        </p>
        <div>
            {props.loadingBackdrop}
        </div>
      <div className={styles.container}>
		<div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
			<h2 className={styles.summaryStyleLarge}>Target ({config.targetPercentage}%)</h2>
			<div className={`${overallStyle} ${overallColour} ${styles.smallSharedCompProps} ${styles.summaryOverall}`}>
				<h3 className={styles.overallTitleStyle}>Overall</h3>
				<h2 className={styles.percentStyle} >{overallPercentStr}</h2>
				<h3 className={styles.overallCentredTitleStyle}>up-to-date</h3>
			</div>
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
        <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
          <div className={styles.summaryCompHeader}>
            <h4 className={styles.summaryStyle}>Dependent Repos</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
