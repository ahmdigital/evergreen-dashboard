import React, { useState } from "react";
import styles from "./SummaryContainer.module.css";
import sharedStyles from "./treeView.module.css";
import ReposOverviewTable from "./SummaryComponents/RepoOverviewTable/ReposOverviewTable";
import helpIcon from "./images/helpIcon.png";
import Image from "next/image";
import HelpScreen from "./HelpScreen";
import headerStyles from "./HeaderContainer.module.css";
import org from "../config.json";
import { ProcessedDependencyData } from "../hooks/useProcessDependencyData";
import ReposSecondarySummaryTable from "./SummaryComponents/ReposSecondarySummaryTable";
import { Filter } from "../src/sortingAndFiltering";

export default function SummaryContainer(props: {
  rankArray: any;
  loadingBackdrop: any;
  rows: ProcessedDependencyData;
  filterTerm: Filter;
  setFilterTerm: any;
}) {
  const totalRepos =
    props.rankArray.green + props.rankArray.yellow + props.rankArray.red;
  let overallPercent = Math.round((props.rankArray.green / totalRepos) * 100);

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
        <div className={`${styles.summaryComponent} ${styles.sharedCompProps}`}>
          <div className={styles.summaryComponent2}>
			<ReposSecondarySummaryTable rows = {props.rows} filterTerm = {props.filterTerm} setFilterTerm = {props.setFilterTerm}/>
          </div>
        </div>
      </div>
    </div>
  );
}
