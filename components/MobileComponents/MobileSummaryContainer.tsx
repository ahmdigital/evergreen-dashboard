import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import ForestIcon from "@mui/icons-material/Forest";
import RefreshIcon from "@mui/icons-material/Refresh";
import helpIcon from "../images/helpIcon.png";
import mobileStyles from "../../styles/MobileSummaryContainer.module.css";
import config from "../../config.json";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import HelpScreen from "../HelpComponents/LightStatus";
import ReposOverviewTable from "../SummaryComponents/RepoOverviewTable/ReposOverviewTable";
import ReposSecondarySummaryTable from "../SummaryComponents/ReposSecondarySummaryTable";
import { ProcessedDependencyData } from "../../hooks/useProcessDependencyData";
import {
  PageLoaderCurrentData,
  forceNewVersion,
  PageLoaderIsLoading,
  lastRequest,
  PageLoaderSetData,
  PageLoaderSetLoading,
} from "../PageLoader";
import { Filter } from "../../src/sortingAndFiltering";
import styles from "../../styles/SummaryContainer.module.css";
import { useState } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import Collapse from "@mui/material/Collapse";
import Grow from "@mui/material/Grow";
import CondensedSummary from "../SummaryComponents/CondensedSummary/CondensedSummary";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Grid from "@mui/material/Unstable_Grid2";
import { AuxData } from "../../src/dataProcessing";

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

let refreshing = false;

export default function MobileSummaryContainer(props: {
  auxData: AuxData;
  rankArray: any;
  loadingSnackbar: any;
  rows: ProcessedDependencyData;
  filterTerm: Filter;
  setFilterTerm: any;
  targetOrganisation: string;
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
      data: PageLoaderCurrentData,
    } as any);

    refreshing = true;

    forceNewVersion(lastRequest).then(async (result) => {
      PageLoaderSetData(result as any);
      PageLoaderSetLoading(false);
      refreshing = false;
    });
  }

  // swipeable component settings
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box className={mobileStyles.summaryContainer}>
      <Box className={mobileStyles.summaryContainerSubBox}>
        <h2 className="noMargins">
          <ForestIcon /> Evergreen Dashboard
        </h2>
        <p className={mobileStyles.subtitle}>
          Monitoring dependencies for the{" "}
          {props.auxData?.orgName && (
            <b className={styles.orgTitle}>
              <a
                className={styles.orgLink}
                href={props.auxData?.orgLink ? props.auxData.orgLink : ""}
              >
                {props.auxData.orgName}
              </a>
            </b>
          )}{" "}
          Github Organisation
        </p>

        <div className={mobileStyles.refresh}>
          <p className={mobileStyles.subtitle2}>
            Last updated:{" "}
            {props.auxData?.crawlStart
              ? dayjs(parseInt(props.auxData?.crawlStart)).fromNow()
              : "N/A"}{" "}
          </p>
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
                  backgroundColor: "#424242",
                },
				padding: '0.6rem 1rem'
              }}
			  size='large'
              onClick={callRefresh}
            >
              Refresh
            </Button>
          </Tooltip>
        </div>
        <div>{props.loadingSnackbar}</div>
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
        <Collapse in={closeHeader} timeout="auto" unmountOnExit>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            <div className={`${mobileStyles.summaryComponent}`}>
              <h3 className={styles.summaryStylePercent}>
                Target ({config.targetPercentage}%)
              </h3>
              <div
                className={`${overallStyle} ${overallColour} ${styles.smallSharedCompProps} ${styles.summaryOverall}`}
              >
                <h3 className={styles.overallTitleStyle}>Overall</h3>
                <h3 className={styles.percentStyle}>{overallPercentStr}</h3>
                <h3 className={styles.overallCentredTitleStyle}>up-to-date</h3>
              </div>
            </div>

            <div className={`${mobileStyles.summaryComponent}`}>
              <div className={styles.summaryCompHeader}>
                <h3 className={styles.summaryStyle}>{`Total Repositories (${
                  props.rankArray.green +
                  props.rankArray.yellow +
                  props.rankArray.red
                })`}</h3>
                <div
                  style={{
                    display: "flex",
                    width: "70px",
                    justifyContent: "space-between",
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
                </div>
              </div>
              {openHelp && <HelpScreen closeHelp={setOpenHelp} />}
              <div>
                <div className={styles.summaryComponent2}>
                  <ReposOverviewTable
                    rankArray={props.rankArray}
                    showChart={showChart}
                  />
                </div>
              </div>
            </div>

            <div className={`${mobileStyles.summaryComponent}`}>
              <h3 className={styles.summaryStylePercent}>Most Common:</h3>
              <div className={mobileStyles.summaryComponent3}>
                <ReposSecondarySummaryTable
                  rows={props.rows}
                  filterTerm={props.filterTerm}
                  setFilterTerm={props.setFilterTerm}
                />
              </div>
            </div>
          </SwipeableViews>

          <MobileStepper
            steps={3}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="large"
                onClick={handleNext}
                disabled={activeStep === 2}
				sx={{padding: '0.65rem 0.2rem'}}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="large"
                onClick={handleBack}
                disabled={activeStep === 0}
				sx={{padding: '0.65rem 0.2rem'}}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
              </Button>
            }
          />
        </Collapse>
        <div className={styles.expandButton}>
          <Button
            variant="text"
            aria-label={
              closeHeader
                ? "expand summary section"
                : "collapse summary section"
            }
            size="small"
            onClick={() => setCloseHeader(!closeHeader)}
            className={styles.expandButton}
			sx={{
				padding: '0.6rem 0rem'
			}}
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
    </Box>
  );
}
