import { Divider, Container, Grid } from "@mui/material";
import Image from "next/image";
import redIcon from "../../images/redIcon.svg";
import greenIcon from "../../images/greenIcon.svg";
import yellowIcon from "../../images/yellowIcon.svg";
import styles from "./CondensedSummary.module.css";
import Box from "@mui/material/Box";
import sharedStyles from "../../treeView.module.css";
import HeaderContainer from "../../HeaderContainer";

import RefreshButton from "../../RefreshButton";

export type RepoOverviewCondensedProps = {
  readonly red: number | string;
  readonly green: number | string;
  readonly yellow: number | string;
};

type CondensedRepoSummaryProps = {
  statusValues: RepoOverviewCondensedProps;
  overall?: number;
  target: number;
};

const Summary = (props: CondensedRepoSummaryProps) => {
  const { red, green, yellow } = props.statusValues;
  const overall = props.overall;
  const target = props.target;

  const overallStatusColour = () => {
    if (typeof overall === "undefined") {
      return "var(--colour-red)";
    } else {
      if (overall < target) {
        return "var(--colour-red)";
      } else {
        return "var(--colour-green)";
      }
    }
  };

  return (
    <Container className={styles.rootContainer} maxWidth="xs">
      <Container className={styles.topPart}>
        <Box className={styles.percentageContainer}>
          <label>Overall:</label>
          <Box
            component="span"
            className={`${styles.overall} ${styles.percentage}`}
            sx={{ bgcolor: overallStatusColour }}
          >
            {overall ? `${overall}%` : "N/A"}
          </Box>
        </Box>
        <Box component={"span"} className={styles.percentageContainer}>
          <label>Target:</label>
          <Box component="span" className={`${styles.percentage}`}>
            {`${target}%`}
          </Box>
        </Box>
      </Container>
      <Divider />
      <Container className={styles.statuses}>
        <Box className={styles.status}>
          <label>{red}</label>
          <Image src={redIcon} alt="Red" width="30px" height="30px"></Image>
        </Box>

        <Box className={styles.status}>
          <label>{green}</label>
          <Image src={greenIcon} alt="Green" width="30px" height="30px"></Image>
        </Box>

        <Box className={styles.status}>
          <label>{yellow}</label>
          <Image
            src={yellowIcon}
            alt="Yellow"
            width="30px"
            height="30px"
          ></Image>
        </Box>
      </Container>
    </Container>
  );
};
export default function CondensedSummary(props: CondensedRepoSummaryProps) {
  return (
    <Box
      sx={{ flexGrow: 1 }}
      className={`${styles.summaryStyle} ${sharedStyles.sectionContainer}`}
    >
      <Grid container spacing={1} className={styles.container}>
        <Grid>
          <HeaderContainer />
          <div>
            {"Last updated DD/MM/YY HH/MM AEST"}
            <RefreshButton iconSize={"15rem"} fontSize={"1rem"} />
          </div>
        </Grid>
      </Grid>
      <Summary
        statusValues={props.statusValues}
        overall={props.overall}
        target={props.target}
      />
    </Box>
  );
}
