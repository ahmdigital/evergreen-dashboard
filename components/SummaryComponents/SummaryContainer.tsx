import React, { useMemo, useState } from "react";
import styles from "../../styles/SummaryContainer.module.css";
import sharedStyles from "../../styles/TreeView.module.css";
import ReposOverviewTable from "./RepoOverviewTable/ReposOverviewTable";
import helpIcon from "../images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "../HelpComponents/LightStatus";
import ForestIcon from "@mui/icons-material/Forest";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  PageLoaderCurrentData,
  forceNewVersion,
  PageLoaderIsLoading,
  lastRequest,
  PageLoaderSetData,
  PageLoaderSetLoading,
} from "../PageLoader";
import { ProcessedDependencyData } from "../../hooks/useProcessDependencyData";
import ReposSecondarySummaryTable from "./ReposSecondarySummaryTable";
import { Filter } from "../../src/sortingAndFiltering";
import Collapse from "@mui/material/Collapse";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import getConfig from "next/config";

import CondensedSummary from "./CondensedSummary/CondensedSummary";
import BarChartIcon from "@mui/icons-material/BarChart";
import { AuxData } from "../../src/dataProcessing";

const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
import Button from "@mui/material/Button";

const { publicRuntimeConfig: config } = getConfig();
let refreshing = false;

function getOverallEvaluation(counts: {red: number, green: number, yellow: number}){
	const totalRepos = counts.green + counts.yellow + counts.red
	const goodRepos = counts.green + (config.allowModerateRepos ? counts.yellow : 0)
	const percent = Math.round((goodRepos / totalRepos) * 100);
	return {
		totalRepos: totalRepos,
		goodRepos: goodRepos,
		percent: percent,
		percentString: percent + "%"
	}
}

export default function SummaryContainer(props: {
  auxData: AuxData;
  rankArray: any;
  loadingSnackbar: any;
  rows: ProcessedDependencyData;
  filterTerm: Filter;
  setFilterTerm: any;
  targetOrganisation: string;
}) {
  let overallEvaluation = getOverallEvaluation(props.rankArray)
  let overallStyle = styles.summaryOverall;
  let overallColour = styles.summaryOverallGreen;
  console.log("TARGET", props.targetOrganisation);

  if (isNaN(overallEvaluation.percent)) {
    overallEvaluation.percentString = "N/A";
    overallColour = styles.summaryOverallGrey;
  } else if (overallEvaluation.percent < config.targetPercentage) {
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

  const renderRepoOverviewTable = useMemo(() => {
    return (
      <ReposOverviewTable rankArray={props.rankArray} showChart={showChart} />
    );
  }, [props.rankArray, showChart]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: "space-between",
      }}
      className={`${styles.summaryStyle} ${sharedStyles.sectionContainer}`}
    >
      <Grid container spacing={1} className={styles.container}>
        <Grid>
          <h1 className={styles.noMargins}>
            <ForestIcon /> Evergreen Dashboard
          </h1>
          <p className={styles.subtitle}>
            Monitoring dependencies for{" "}
            {props.auxData?.orgName && (
              <span className={styles.orgTitle}>
                <a
                  className={styles.orgLink}
                  href={props.auxData?.orgLink && props.auxData.orgLink}
                >
                  {props.auxData.orgName}
                </a>
              </span>
            )}{" "}
            Github Organisation
          </p>
          <div className={styles.btnsContainer}>
            <Tooltip
              arrow
              title={
                <p className={styles.tooltipStyle}>
                  Check for new repository updates
                </p>
              }
            >
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                sx={{
                  backgroundColor: "var(--colour-black)",
                  borderRadius: "var(--main-section-border-radius)",
                  "&:hover": {
                    backgroundColor: "var(--colour-black-hover)",
                  },
                }}
                onClick={callRefresh}
              >
                Refresh
              </Button>
            </Tooltip>
            <span className={styles.lastUpdated}>
              Last updated:{" "}
              {props.auxData?.crawlStart
                ? dayjs(parseInt(props.auxData?.crawlStart)).fromNow()
                : "N/A"}
            </span>
          </div>
        </Grid>

        <Grid>
          <Grow in={!closeHeader}>
            <Grid>
              {!closeHeader && (
                <CondensedSummary
                  statusValues={props.rankArray}
                  overall={overallEvaluation.percent}
                  target={config.targetPercentage}
                ></CondensedSummary>
              )}
            </Grid>
          </Grow>
        </Grid>
      </Grid>
      <div>{props.loadingSnackbar}</div>
      <Collapse in={closeHeader} timeout="auto" unmountOnExit>
        <Grid
          container
          spacing={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
            marginTop: "0rem",
            marginBottom: "0rem",
          }}
          className={`${styles.container} ${styles.margins}`}
        >
          <Grid xs={12} sm={12} md={6} lg={4}>
            <div
              className={`${styles.summaryComponent} ${styles.sharedCompProps}`}
            >
			  <h3 style={{marginTop: '18px', marginBottom: '25px'}} className={styles.summaryStylePercent}>
				Target ({config.targetPercentage}%)
			  </h3>
			  
              <div
                className={`${overallStyle} ${overallColour} ${styles.smallSharedCompProps} ${styles.summaryOverall}`}
              >
                <h3 className={styles.overallTitleStyle}>Overall</h3>
                <h3 className={styles.percentStyle}>{overallEvaluation.percentString}</h3>
                <h3 className={styles.overallCentredTitleStyle}>
                  {overallEvaluation.goodRepos}/{overallEvaluation.totalRepos} repositories up-to-date{" "}
                </h3>
              </div>
            </div>
          </Grid>

          <Grid xs={12} sm={12} md={6} lg={4}>
            <div
              className={`${styles.summaryComponent} ${styles.sharedCompProps}`}
            >
              <div className={styles.summaryCompHeader}>
                <h3 className={styles.summaryStyle}>
                  Total Repositories ({overallEvaluation.totalRepos})
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Tooltip
                    placement="top"
                    arrow
                    title={
                      <p className={styles.tooltipStyle}>Toggle Pie Chart</p>
                    }
                  >
                    <IconButton
                      className={styles.helpBtn}
                      aria-label="Chart button"
                      onClick={() => {
                        setShowChart(!showChart);
                      }}
                    >
                      <BarChartIcon className={styles.chartButton} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    placement="top"
                    arrow
                    title={
                      <p className={styles.tooltipStyle}>
                        Status Icon Meanings
                      </p>
                    }
                  >
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
              <div>{renderRepoOverviewTable}</div>
            </div>
          </Grid>
          <Grid xs={12} sm={12} md={6} lg={4}>
            <div
              className={`${styles.summaryComponent} ${styles.sharedCompProps}`}
            >
              <h3 style={{marginTop: '18px', marginBottom: '25px'}} className={styles.summaryStylePercent}>Most Common:</h3>
              <div className={styles.summaryComponent3}>
                <ReposSecondarySummaryTable
                  rows={props.rows}
                  filterTerm={props.filterTerm}
                  setFilterTerm={props.setFilterTerm}
                />
              </div>
            </div>
          </Grid>
        </Grid>
        <div>{props.loadingSnackbar}</div>
      </Collapse>
      <div className={styles.expandButton}>
        <Button
          variant="text"
          aria-label={
            closeHeader ? "expand summary section" : "collapse summary section"
          }
          size="small"
          onClick={() => setCloseHeader(!closeHeader)}
          className={styles.expandButton}
        >
          {closeHeader ? (
            <>
              <KeyboardArrowUpIcon />
              <p className={styles.expandText}>Show Less</p>
            </>
          ) : (
            <>
              <KeyboardArrowDownIcon />
              <p className={styles.expandText}>Show More</p>
            </>
          )}
        </Button>
      </div>
    </Box>
  );
}
