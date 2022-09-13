import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { semVerToString } from "../src/semVer";
import { PackageData } from "../hooks/useProcessDependencyData";
import styles from "./SubRow.module.css";
import Image from "next/image";
import RedIcon from "./images/redIcon.svg";
import YellowIcon from "./images/yellowIcon.svg";
import GreenIcon from "./images/greenIcon.svg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { redDef, yellowDef, greenDef } from "./LightStatus";

export type SubRowProps = {
  dependency: PackageData;
};

// Customising the row styling using ThemeProvider
const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "var(--secondary-font-family)",
          fontSize: "1rem",
          backgroundColor: "#f5f5f5",
          color: "var(--colour-font)",
          borderColor: "#7a7a7a",
        },
      },
    },
  },
});

// Creates the collapsible rows for internal/external dependencies
export function SubRow(props: SubRowProps) {
  // dependencyData contains all the packages and its props (name, version, link etc)
  const depName = props.dependency.name;
  const depLink = props.dependency.link;
  const usedVersion = semVerToString(props.dependency.usedVersion);
  const latestVersion = semVerToString(props.dependency.version);

  let statusIcon = RedIcon;
  let statusText = "Needs updating urgently";
  let iconDefinition = redDef.description;

  // Setting the status
  if (props.dependency.rank == 2) {
    statusIcon = GreenIcon;
    iconDefinition = greenDef.description;
	statusText = "Up to date";
  }
  if (props.dependency.rank == 1) {
    statusIcon = YellowIcon;
    iconDefinition = yellowDef.description;
	statusText = "Should be updated soon";
  }

  return (
    <TableRow>
      <ThemeProvider theme={theme}>
        <TableCell className={styles.tableCellStyle}>
          <Tooltip
            arrow
            title={<p className={styles.tooltipStyle}>{iconDefinition}</p>}
          >
            <div className={styles.iconContainer}>
              <Image
                src={statusIcon}
                alt={statusText}
                width="33px"
                height="33px"
                className={styles.inverseSubRowIcon}
              ></Image>
            </div>
          </Tooltip>
        </TableCell>
        <TableCell className={styles.tableCellStyle}><a href={depLink} rel="noreferrer" target="_blank">
          {depName}
        </a></TableCell>
        <TableCell className={styles.tableCellStyle}>{usedVersion}</TableCell>
        <TableCell
          className={`${styles.tableCellStyle} ${styles.latestVerStyle}`}
        >
          {latestVersion}
        </TableCell>
      </ThemeProvider>
    </TableRow>
  );
}
