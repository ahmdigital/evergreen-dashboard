import React from "react";
import headerStyles from "../../styles/HeaderContainer.module.css";
// import sharedStyles from "../styles/TreeView.module.css";
import ForestIcon from "@mui/icons-material/Forest";
import { RepoOverviewCondensedProps } from "./CondensedSummary/CondensedSummary";

export default function HeaderContainer(props: {targetOrganisation: string}) {
  return (
    <>
      <h2 className="h2NoMargins">
        <ForestIcon /> Evergreen Dashboard
      </h2>
      <p className={headerStyles.headerStyle}>
        Monitoring for <b>{props.targetOrganisation}</b> Github
        Organisation
      </p>
    </>
  );
}

type CondensedHeaderSumProps = {
  rankArray: RepoOverviewCondensedProps;
}
