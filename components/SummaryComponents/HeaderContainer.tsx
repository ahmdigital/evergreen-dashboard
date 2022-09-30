import React from "react";
import headerStyles from "../../styles/HeaderContainer.module.css";
// import sharedStyles from "../styles/TreeView.module.css";
import ForestIcon from "@mui/icons-material/Forest";
import { RepoOverviewCondensedProps } from "./CondensedSummary/CondensedSummary";
import getConfig from "next/config";
const { publicRuntimeConfig: config } = getConfig()

export default function HeaderContainer() {
  return (
    <>
      <h2 className="h2NoMargins">
        <ForestIcon /> Evergreen Dashboard
      </h2>
      <p className={headerStyles.headerStyle}>
        Monitoring for <b>{config.targetOrganisation}</b> Github
        Organisation
      </p>
    </>
  );
}

type CondensedHeaderSumProps = {
  rankArray: RepoOverviewCondensedProps;
}

// export const CondensedHeaderSummaryContainer = (props: CondensedHeaderSumProps) => {

//   return (
//     <div className={`${headerStyles.headerStyle} ${sharedStyles.sectionContainer}`}>
//       <HeaderContainer />
//       <CondensedSummary statusValues={props.rankArray} target={config.targetPercentage} />
//     </div>
//   );
// };
