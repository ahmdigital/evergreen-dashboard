import React, { useState } from "react";
import styles from "./SummaryContainer.module.css";
import sharedStyles from "./treeView.module.css";
import ReposOverviewTable from "./SummaryComponents/RepoOverviewTable/ReposOverviewTable";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "./LightStatus";
import ForestIcon from '@mui/icons-material/Forest';
import Tooltip from "@mui/material/Tooltip";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import refreshIcon from "./images/refresh.svg" ;
import { PageLoaderCurrentData, forceNewVersion, PageLoaderIsLoading, lastRequest, PageLoaderSetData, PageLoaderSetLoading } from "./PageLoader";
import config from "../config.json";

let refreshing = false

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

  async function callRefresh(){
		if(refreshing){ return }
		if(lastRequest == null){ return; }
		if(PageLoaderIsLoading){ return; }
		PageLoaderSetLoading(true)
		PageLoaderSetData({refreshing: true, data: PageLoaderCurrentData as any} as any)

		refreshing = true

		//TODO: Support other configuration
		//switch(mode){
		//	case(Mode.Frontend): break;
		//	case(Mode.StandaloneBackend):break;
		//	case(Mode.IntegratedBackend): {
				forceNewVersion(lastRequest).then(async (result) => {
					PageLoaderSetData(result as any)
					PageLoaderSetLoading(false)
					refreshing = false
				})
		//	} break;
		//}
	}

  return (
    <Box sx={{ flexGrow: 1 }} className={`${styles.summaryStyle} ${sharedStyles.sectionContainer}`}>
      <Grid container spacing={1} className={styles.container}>
        <Grid>
          <h1 className="noMargins"><ForestIcon /> Evergreen Dashboard</h1>
          <p className={styles.subtitle}>
            Monitoring for <b>{config.targetOrganisation}</b> Github Organisation
          </p>
        </Grid>
        <Grid>
          <div className={styles.btnsContainer}>
            <Tooltip arrow title={<p className={styles.tooltipStyle}>Check for new repository updates</p>}>
              <button onClick={callRefresh}>
                <Image src={refreshIcon} alt="refresh" width="20rem" height="20rem"></Image>
                <span className={styles.refreshWord}>Refresh</span>
              </button>
            </Tooltip>
          </div>
        </Grid>
      </Grid>
        <div>
            {props.loadingBackdrop}
        </div>
      <Grid container spacing={1} className={styles.container}>
        <Grid xs={12} sm={12} md={6} lg={4}>
        <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
          <h3 className={styles.summaryStylePercent}>Target ({config.targetPercentage}%)</h3>
          <div className={`${overallStyle} ${overallColour} ${styles.smallSharedCompProps} ${styles.summaryOverall}`}>
            <h3 className={styles.overallTitleStyle}>Overall</h3>
            <h3 className={styles.percentStyle} >{overallPercentStr}</h3>
            <h3 className={styles.overallCentredTitleStyle}>up-to-date</h3>
          </div>
        </div>
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={4}>
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
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={4}>
        <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
          <div className={styles.summaryCompHeader}>
            <h3 className={styles.summaryStyle}>Dependent Repos</h3>
          </div>
        </div>
        </Grid>
      </Grid>
    </Box>
  );
}
