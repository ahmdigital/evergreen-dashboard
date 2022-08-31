import { Divider, Container } from "@mui/material";
import Image from "next/image";
import redIcon from "../../images/redIcon.svg";
import greenIcon from "../../images/greenIcon.svg";
import yellowIcon from "../../images/yellowIcon.svg";
import styles from "./CondensedSummary.module.css";
import Box from "@mui/material/Box";

type RepoOverviewCondensedProps = {
  readonly red: number | string;
  readonly green: number | string;
  readonly orange: number | string;
};

type CondensedRepoSummaryProps = {
  statusValues: RepoOverviewCondensedProps;
  percentages: {
    overall?: number;
    target: number;
  };
};

export default function CondensedSummary(props: CondensedRepoSummaryProps) {
  const { red, green, orange } = props.statusValues;
  const { overall, target } = props.percentages;
  const overallStatusColour = () => {
    if (typeof overall === "undefined") {
      return "var(--colour-red)";
    } else {
      if (overall < target * 0.75) {
        return "var(--colour-red)";
      } else if (overall < target) {
        return "var(--colour-orange)";
      } else {
        return "var(--colour-green)";
      }
    }
  };

  console.log(red, green, orange);
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
        <Box component={"span"} className={styles.percentageContainer} >
          <label>Target:</label>
          <Box component="span" className={`${styles.percentage}`}>
            {`${target}%`}
          </Box>
        </Box>
      </Container>
      <Divider  />
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
            <label>{orange}</label>
            <Image src={yellowIcon} alt="Yellow" width="30px" height="30px"></Image>
        </Box>
      </Container>
    </Container>
  );
}
