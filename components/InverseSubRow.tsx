import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { semVerToString } from "../src/semVer";
import { SubRowProps } from "./SubRow";
import Image from "next/image";
import styles from "../styles/SubRow.module.css";
import RedIcon from "./images/redIcon.svg"
import YellowIcon from "./images/yellowIcon.svg";
import GreenIcon from "./images/greenIcon.svg";
import { createTheme, ThemeProvider } from "@mui/material/styles";

type InverseSubRowProps = {
  //This is just renaming dependency to user to make it more clear
  user: SubRowProps["dependency"];
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

export function InverseSubRow(props: InverseSubRowProps) {
  const userName = props.user.name;
  const usedVersion = semVerToString(props.user.version);

  let statusIcon = RedIcon;

  // Setting the status
  if (props.user.rank == 2) {
    statusIcon = GreenIcon;
  }
  if (props.user.rank == 1) {
    statusIcon = YellowIcon;
  }

  return (
    <TableRow className={styles.inverseSubRow}    >
      <ThemeProvider theme={theme}>
        <TableCell>
          <Image
            src={statusIcon}
            alt="Repo Priority"
            width="33px"
            height="33px"
            className={styles.inverseSubRowIcon}
          ></Image>
        </TableCell>
        <TableCell >{userName}</TableCell>
        <TableCell>{usedVersion}</TableCell>
      </ThemeProvider>
    </TableRow>
  );
}
