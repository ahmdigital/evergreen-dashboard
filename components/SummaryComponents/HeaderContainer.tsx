import React from "react";
import headerStyles from "../../styles/HeaderContainer.module.css";
// import sharedStyles from "../styles/TreeView.module.css";
import ForestIcon from "@mui/icons-material/Forest";
import { RepoOverviewCondensedProps } from "./CondensedSummary/CondensedSummary";

export async function getServerSideProps() {
  return {
    props: {
      targetOrganisation: process.env.NEXT_PUBLIC_TARGET_ORGANISATION,
    }
  }
}

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