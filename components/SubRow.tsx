import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { semVerToString } from "../src/semVer";
import { PackageData } from "../hooks/useProcessDependencyData";
import styles from "./SubRow.module.css";
import Image from "next/image";
import RedIcon from "./images/redIcon.svg";
import YellowIcon from "./images/yellowIcon.svg";
import GreenIcon from "./images/greenIcon.svg";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
          fontSize: "1.1rem",
          backgroundColor: "#f5f5f5",
          color: "var(--colour-font)",
          borderColor: "#7a7a7a",
        }
      }
    }
  }
})

// Creates the collapsible rows for internal/external dependencies
export function SubRow(props: SubRowProps) {
  // dependencyData contains all the packages and its props (name, version, link etc)
  const depName = props.dependency.name;
  const usedVersion = semVerToString(props.dependency.usedVersion);
  const latestVersion = semVerToString(props.dependency.version);

  let statusIcon = RedIcon;

  // Setting the status
  if (props.dependency.rank == 2) {
    statusIcon = GreenIcon;
  }
  if (props.dependency.rank == 1) {
    statusIcon = YellowIcon;
  }

  return (
    <TableRow >
      <ThemeProvider theme={theme}>
        <TableCell className={styles.tableCellStyle}>
          <Image
            src={statusIcon}
            alt="Repo Priority"
            width="33px"
            height="33px"
            className={styles.inverseSubRowIcon}
          ></Image>
        </TableCell>
        <TableCell className={styles.tableCellStyle}>{depName}</TableCell>
        <TableCell className={styles.tableCellStyle}>{usedVersion}</TableCell>
        <TableCell className={`${styles.tableCellStyle} ${styles.latestVerStyle}`}>{latestVersion}</TableCell>
      </ThemeProvider>
    </TableRow>
  );
}
