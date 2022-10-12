import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { semVerToString } from "../../src/semVer";
import { PackageData } from "../../hooks/useProcessDependencyData";
import styles from "../../styles/SubRow.module.css";
import Image from "next/image";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  rankToStatusType,
  statusDefinitionsDeps,
  statusLabel,
} from "../constants";
import { iconImg } from "../icons/IconFactory";

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

  const statusType = rankToStatusType[props.dependency.rank];

  const statusIcon = iconImg[statusType];
  const statusText = statusLabel[statusType];
  const iconDefinition = statusDefinitionsDeps[statusType];

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
        <TableCell className={styles.tableCellStyle}>
          <a href={depLink} rel="noreferrer" target="_blank">
            {depName}
          </a>
        </TableCell>
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
