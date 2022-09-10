import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { semVerToString } from "../src/semVer";
import { SubRowProps } from "./SubRow";
import Image from "next/image";
import styles from "./SubRow.module.css";
import RedIcon from "./images/redIcon.svg"
import YellowIcon from "./images/yellowIcon.svg";
import GreenIcon from "./images/greenIcon.svg";
import { createTheme, ThemeProvider } from "@mui/material/styles";

type InverseSubRowProps = {
  //This is just renaming dependency to user to make it more clear
  user: SubRowProps["dependency"];
};

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
  const depLink = props.user.link;

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
			<TableCell className={styles.tableCellStyle}>
				<Image
				src={statusIcon}
				alt="Repo Priority"
				width="33px"
				height="33px"
				className={styles.inverseSubRowIcon}
				></Image>
			</TableCell>
			<TableCell className={styles.tableCellStyle}>
				<a href={depLink} rel="noreferrer" target="_blank">
				{userName}
				</a>
			</TableCell>
			<TableCell className={styles.tableCellStyle}>{usedVersion}</TableCell>
			{/* <button onClick = {() => {testClickFunction(userName)}}> </button> */}
		</ThemeProvider>
    </TableRow>
  );
}
