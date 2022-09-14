import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import ForestIcon from '@mui/icons-material/Forest';
import refreshIcon from "../images/refresh.svg";
import helpIcon from "../images/helpIcon.png";
import mobileStyles from "./MobileSummaryContainer.module.css";
import config from "../../config.json";
import Tooltip from '@mui/material/Tooltip';
import Image from "next/image";
import IconButton from '@mui/material/IconButton';
import HelpScreen from '../LightStatus';
import ReposOverviewTable from '../SummaryComponents/RepoOverviewTable/ReposOverviewTable';
import ReposSecondarySummaryTable from "../SummaryComponents/ReposSecondarySummaryTable";
import { ProcessedDependencyData } from "../../hooks/useProcessDependencyData";
import { 
    PageLoaderCurrentData, 
    forceNewVersion, 
    PageLoaderIsLoading, 
    lastRequest, 
    PageLoaderSetData, 
    PageLoaderSetLoading 
} from "../PageLoader";
import { Filter } from "../../src/sortingAndFiltering";
import styles from "../SummaryContainer.module.css";
import { useState } from 'react';


let refreshing = false;

export default function MobileSummaryContainer(props: {
    rankArray: any;
    loadingBackdrop: any;
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
        <Box className={`${mobileStyles.summaryContainer}`}>
            <h2 className="noMargins"><ForestIcon /> Evergreen Dashboard</h2>
            <p className={mobileStyles.subtitle}>
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
          <div>
            {props.loadingBackdrop}
          </div>
        <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
        >
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
                <h3 className={styles.summaryStyle}>{`Total Repositories (${props.rankArray.green + props.rankArray.yellow + props.rankArray.red})`}</h3>
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

            <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
              <div className={styles.summaryComponent3}>
                <ReposSecondarySummaryTable rows={props.rows} filterTerm={props.filterTerm} setFilterTerm={props.setFilterTerm} />
              </div>
            </div>
        </SwipeableViews>

        <MobileStepper
            steps={3}
            position="static"
            activeStep={activeStep}
            nextButton={
                <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === 2}
                >
                    {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                    ) : (
                    <KeyboardArrowRight />
                    )}
                </Button>
                }
                backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                    ) : (
                    <KeyboardArrowLeft />
                    )}
                </Button>
                }
        />
        </Box>
    );
}
