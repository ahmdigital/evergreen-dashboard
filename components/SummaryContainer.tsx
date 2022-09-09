import React, { useState } from "react";
import styles from "./SummaryContainer.module.css";
import sharedStyles from "./treeView.module.css";
import ReposOverviewTable from "./SummaryComponents/RepoOverviewTable/ReposOverviewTable";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "./LightStatus";
import ForestIcon from '@mui/icons-material/Forest';
import Tooltip from "@mui/material/Tooltip";
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
        <h1 className="noMargins"><ForestIcon />  Evergreen Dashboard</h1>
        <p className={styles.subtitle}>
          Monitoring for <b>{config.targetOrganisation}</b> Github Organisation
        </p>
        <div>
            {props.loadingBackdrop}
        </div>
      <div className={styles.container}>
		<div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
			<h3 className={styles.summaryStylePercent}>Target ({config.targetPercentage}%)</h3>
			<div className={`${overallStyle} ${overallColour} ${styles.smallSharedCompProps} ${styles.summaryOverall}`}>
				<h3 className={styles.overallTitleStyle}>Overall</h3>
				<h3 className={styles.percentStyle} >{overallPercentStr}</h3>
				<h3 className={styles.overallCentredTitleStyle}>up-to-date</h3>
			</div>
        </div>

        <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
          <div className={styles.summaryCompHeader}>
{/* Check the styles.summaryStyle is needed */}
          <h3 className={styles.summaryStyle}>{`Total Repos (${props.rankArray.green + props.rankArray.yellow + props.rankArray.red})`}</h3>
            <Tooltip arrow title={<p className={styles.tooltipStyle}>Status Icon Meanings</p>}>
              <div>
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
            </Tooltip>
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
            <h3 className={styles.summaryStyle}>Dependent Repos</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
