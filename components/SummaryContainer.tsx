import React, { useState } from "react";
import styles from "./SummaryContainer.module.css";
import sharedStyles from "./treeView.module.css";
import ReposOverviewTable from "./SummaryComponents/RepoOverviewTable/ReposOverviewTable";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "./LightStatus";
import headerStyles from "./HeaderContainer.module.css";
import ForestIcon from "@mui/icons-material/Forest";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Collapse from "@mui/material/Collapse";
import Grow from '@mui/material/Grow';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import refreshIcon from "./images/refresh.svg" ;
import { IconButton } from "@mui/material";

import {
  PageLoaderCurrentData,
  forceNewVersion,
  PageLoaderIsLoading,
  lastRequest,
  PageLoaderSetData,
  PageLoaderSetLoading,
} from "./PageLoader";
import config from "../config.json";
import CondensedSummary from "./SummaryComponents/CondensedSummary/CondensedSummary";

let refreshing = false;

export default function SummaryContainer(props: {
  rankArray: any;
  loadingBackdrop: any;
}) {
  const totalRepos =
    props.rankArray.green + props.rankArray.yellow + props.rankArray.red;
  let overallPercent = Math.round((props.rankArray.green / totalRepos) * 100);
  let overallPercentStr = overallPercent + "%";
  let overallStyle = styles.summaryOverall;
  let overallColour = styles.summaryOverallGreen;

  if (isNaN(overallPercent)) {
    overallPercentStr = "N/A";
    overallColour = styles.summaryOverallGrey;
  } else if (overallPercent < config.targetPercentage) {
    overallColour = styles.summaryOverallRed;
  }

  // State for opening the helpLegend
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  // State for collapsing the header
  const [closeHeader, setCloseHeader] = useState<boolean>(true);

  async function callRefresh() {
    if (refreshing) {
      return;
    }
    if (lastRequest == null) {
      return;
    }
    if (PageLoaderIsLoading) {
      return;
    }
    PageLoaderSetLoading(true);
    PageLoaderSetData({
      refreshing: true,
      data: PageLoaderCurrentData as any,
    } as any);

    refreshing = true;

    //TODO: Support other configuration
    //switch(mode){
    //	case(Mode.Frontend): break;
    //	case(Mode.StandaloneBackend):break;
    //	case(Mode.IntegratedBackend): {
    forceNewVersion(lastRequest).then(async (result) => {
      PageLoaderSetData(result as any);
      PageLoaderSetLoading(false);
      refreshing = false;
    });
    //	} break;
    //}
  }

  return (
    <Box
      sx={{ flexGrow: 1 }}
      className={`${styles.summaryStyle} ${sharedStyles.sectionContainer}`}
    >
      <Grid container spacing={1} className={styles.container}>
        <Grid>
          <h1 className="noMargins"><ForestIcon /> Evergreen Dashboard</h1>
          <p className={styles.subtitle}>
            Monitoring dependencies for <b>{config.targetOrganisation}</b> Github Organisation
          </p>
          <p className={headerStyles.headerStyle}>
            {"Last updated DD/MM/YY HH/MM AEST"}
          </p>
        </Grid>
        <Grid>
          <div className={styles.btnsContainer}>
            <Tooltip arrow title={<p className={styles.tooltipStyle}>Check for new repository updates</p>}>
              <button onClick={callRefresh} aria-label="Refresh data">
                <Image src={refreshIcon} alt="Refresh Icon" width="15rem" height="15rem"></Image>
                <span className={styles.refreshWord}>Refresh</span>
              </button>
            </Tooltip>
          </div>
        </Grid>
      </Grid>
        <div>
            {props.loadingBackdrop}
        </div>
      <Grid container spacing={1} className={`${styles.container} ${styles.margins}`}>
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
          <h3 className={styles.summaryStyle}>{`Total Repos (${props.rankArray.green + props.rankArray.yellow + props.rankArray.red})`}</h3>
            <Tooltip placement="top" arrow title={<p className={styles.tooltipStyle}>Status Icon Meanings</p>}>
              <IconButton
			    aria-label="Help button"
				onClick={() => {
                  setOpenHelp(true);
                }}
			  >
              <Image
                  className={styles.helpBtn}
                  width="30px"
                  height="30px"
                  alt="Help Icon"
                  src={helpIcon}
                />
              </IconButton>
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
        <Grow in={!closeHeader}>
          <Grid>
            {!closeHeader && (
              <div>
                <CondensedSummary
                  statusValues={props.rankArray}
                  overall={overallPercent}
                  target={config.targetPercentage}
                ></CondensedSummary>
              </div>
            )}
          </Grid>
        </Grow>
      </Grid>
      <div>{props.loadingBackdrop}</div>
      <>
        <Collapse in={closeHeader} timeout="auto" unmountOnExit>
          <Grid container spacing={1} className={styles.container}>
            <Grid xs={12} sm={12} md={6} lg={4}>
              <div
                className={`${styles.summaryComponent} ${styles.sharedCompProps}`}
              >
                <h4 className={styles.summaryStylePercent}>
                  Target ({config.targetPercentage}%)
                </h4>
                <div
                  className={`${overallStyle} ${overallColour} ${styles.smallSharedCompProps} ${styles.summaryOverall}`}
                >
                  <h3 className={styles.overallTitleStyle}>Overall</h3>
                  <h2 className={styles.percentStyle}>{overallPercentStr}</h2>
                  <h3 className={styles.overallCentredTitleStyle}>up-to-date</h3>
                </div>
              </div>
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={4}>
              <div
                className={`${styles.summaryComponent} ${styles.sharedCompProps}`}
              >
                <div className={styles.summaryCompHeader}>
                  <h4 className={styles.summaryStyle}>Repos Overview</h4>
                  <Tooltip
                    arrow
                    title={
                      <p className={styles.tooltipStyle}>Status Icon Meanings</p>
                    }
                  >
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
              <div
                className={`${styles.summaryComponent} ${styles.sharedCompProps}`}
              >
                <div className={styles.summaryCompHeader}>
                  <h4 className={styles.summaryStyle}>Dependent Repos</h4>
                </div>
              </div>
            </Grid>
          </Grid>
        </Collapse>
      </>
      {/* <button onClick={() => setCloseHeader(!closeHeader)}>Show Less</button> */}
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => setCloseHeader(!closeHeader)}
      >
        {closeHeader ? <><KeyboardArrowUpIcon />Show Less</> : <><KeyboardArrowDownIcon />Show More</>}
      </IconButton>
    </Box>
  );
}
