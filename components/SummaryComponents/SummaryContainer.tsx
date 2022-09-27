import React, { useState } from "react";
import styles from "../../styles/SummaryContainer.module.css";
import sharedStyles from "../../styles/TreeView.module.css";
import ReposOverviewTable from "./RepoOverviewTable/ReposOverviewTable";
import helpIcon from "../images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "../HelpComponents/LightStatus";
import ForestIcon from "@mui/icons-material/Forest";
import Tooltip from "@mui/material/Tooltip";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import refreshIcon from "../images/refresh.svg";
import { PageLoaderCurrentData, forceNewVersion, PageLoaderIsLoading, lastRequest, PageLoaderSetData, PageLoaderSetLoading } from "../PageLoader";
import config from "../../config.json";

let refreshing = false
import { ProcessedDependencyData } from "../../hooks/useProcessDependencyData";
import ReposSecondarySummaryTable from "./ReposSecondarySummaryTable";
import { Filter } from "../../src/sortingAndFiltering";
import Collapse from "@mui/material/Collapse";
import Grow from '@mui/material/Grow';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CondensedSummary from "./CondensedSummary/CondensedSummary";
import BarChartIcon from '@mui/icons-material/BarChart';


export default function SummaryContainer(props: {
  rankArray: any;
  loadingSnackbar: any;
  rows: ProcessedDependencyData;
  filterTerm: Filter;
  setFilterTerm: any;
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
  const [showChart, setShowChart] = useState<boolean>(false);

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
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}
      className={`${styles.summaryStyle} ${sharedStyles.sectionContainer}`}
    >
      <Grid container spacing={1} className={styles.container}>
        <Grid>
          <h1 className="noMargins"><ForestIcon /> Evergreen Dashboard</h1>
          <p className={styles.subtitle}>
            Monitoring dependencies for <b>{config.targetOrganisation}</b> Github Organisation
          </p>
          <div className={styles.btnsContainer}>
            <Tooltip arrow title={<p className={styles.tooltipStyle}>Check for new repository updates</p>}>
              <button onClick={callRefresh} aria-label="Refresh data">
                <Image src={refreshIcon} alt="Refresh Icon" width="15rem" height="15rem"></Image>
                <span className={styles.refreshWord}>Refresh</span>
              </button>
            </Tooltip>
          </div>
        </Grid>
        
        <Grid>
          <Grow in={!closeHeader}>
            <Grid>
              {!closeHeader && (
                <CondensedSummary
                  statusValues={props.rankArray}
                  overall={overallPercent}
                  target={config.targetPercentage}
                ></CondensedSummary>
              )}
            </Grid>
          </Grow>
        </Grid>
      </Grid>
      <div>
        {props.loadingSnackbar}
      </div>
      <Collapse in={closeHeader} timeout="auto" unmountOnExit>
        <Grid container spacing={1} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', marginTop: '0rem', marginBottom: '0rem' }} className={`${styles.container} ${styles.margins}`}>
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
              <h3 className={styles.summaryStyle}>Total Repositories ({props.rankArray.green + props.rankArray.yellow + props.rankArray.red})</h3>
                <div style={{display: "flex", width: "70px", justifyContent: "space-between"}}>
                <Tooltip placement="top" arrow title={<p className={styles.tooltipStyle}>Toggle Pie Chart</p>}>
                    <IconButton
                      className={styles.helpBtn}
                      aria-label="Chart button"
                      onClick={() => {
                        setShowChart(!showChart);
                      }}
                    ><BarChartIcon className={styles.chartButton}/></IconButton></Tooltip>
                  <Tooltip placement="top" arrow title={<p className={styles.tooltipStyle}>Status Icon Meanings</p>}>
                    <IconButton
                      className={styles.helpBtn}
                      aria-label="Help button"
                      onClick={() => {
                        setOpenHelp(true);
                      }}
                    >
                      <Image
                        width="30px"
                        height="30px"
                        alt="Help Icon"
                        src={helpIcon}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              {openHelp && <HelpScreen closeHelp={setOpenHelp} />}
              <div>
                <div className={styles.summaryComponent2}>
                  <ReposOverviewTable rankArray={props.rankArray} showChart={showChart} />
                </div>
              </div>
            </div>
          </Grid>
          <Grid xs={12} sm={12} md={6} lg={4}>
            <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
              <div className={styles.summaryComponent3}>
                <ReposSecondarySummaryTable rows={props.rows} filterTerm={props.filterTerm} setFilterTerm={props.setFilterTerm} />
              </div>
            </div>
          </Grid>
        </Grid>
        <div>{props.loadingSnackbar}</div>
      </Collapse>
      <div className={styles.expandButton}>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setCloseHeader(!closeHeader)}
        >
          {closeHeader ? <><KeyboardArrowUpIcon />Show Less</> : <><KeyboardArrowDownIcon />Show More</>}
        </IconButton>
      </div>
    </Box>
  );
}
