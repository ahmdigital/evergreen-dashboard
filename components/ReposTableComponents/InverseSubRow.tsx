import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { semVerToString } from "../../src/semVer";
import { SubRowProps } from "./SubRow";
import Image from "next/image";
import styles from "../../styles/SubRow.module.css";
import RedIcon from "../images/redIcon.svg"
import YellowIcon from "../images/yellowIcon.svg";
import GreenIcon from "../images/greenIcon.svg";
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
export function testClickFunction(name: string) {
  let mainTableBody = document.getElementById("mainTableBody");
  if (mainTableBody == null) { return }
  let children = mainTableBody.children;
  console.log(children.length)
  console.log(name)

  var instance = children[1]

  console.log(instance)

  if (instance instanceof HTMLElement) {

    if (instance.getAttribute('aria-expanded') == 'false') { // region is collapsed

      // update the aria-expanded attribute of the region
      instance.setAttribute('aria-expanded', 'true');

      // move focus to the region
      instance.focus();

      // update the button label
      //thisObj.$toggle.find('span').html('Hide');

    }
    else { // region is expanded

      // update the aria-expanded attribute of the region
      instance.setAttribute('aria-expanded', 'false');

      // update the button label
      //thisObj.$toggle.find('span').html('Show');
    }
  }
}

export function InverseSubRow(props: InverseSubRowProps) {
  const userName = props.user.name;
  const usedVersion = semVerToString(props.user.version);
  const depLink = props.user.link;

  let statusIcon = RedIcon;
  let statusText = "Needs updating urgently";
  // Setting the status
  if (props.user.rank == 2) {
    statusIcon = GreenIcon;
    statusText = "Up to date";
  }
  if (props.user.rank == 1) {
    statusIcon = YellowIcon;
    statusText = "Should be updated soon";
  }

  return (
    <TableRow className={styles.inverseSubRow}    >
      <ThemeProvider theme={theme}>
        <TableCell>
          <Image
            src={statusIcon}
            alt={statusText}
            width="33px"
            height="33px"
            className={styles.inverseSubRowIcon}
          ></Image>
        </TableCell>
        <TableCell ><a href={depLink} rel="noreferrer" target="_blank">
          {userName}
        </a></TableCell>
        <TableCell>{usedVersion}</TableCell>
        {/* <button onClick = {() => {testClickFunction(userName)}}> </button> */}
      </ThemeProvider>
    </TableRow>
  );
}