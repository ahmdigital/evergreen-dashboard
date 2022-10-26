import Image from "next/image";
import getConfig from "next/config";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import closeIcon from "../images/closeIcon.png";
import greenIcon from "../images/greenIcon.svg";
import yellowIcon from "../images/yellowIcon.svg";
import redIcon from "../images/redIcon.svg";
import styles from "../../styles/LightStatus.module.css";
import { semVerFromString } from "../../src/semVer";

const { publicRuntimeConfig: config } = getConfig();

export type HelpScreenProps = {
	closeHelp: (_value: boolean | ((_prev: boolean) => boolean)) => void;
};

// class created to make linking of descriptions to config easier later on
class VersionDefinition {
	description: string;

	constructor(description: string) {
		this.description = description;
	}
}

// Customising the table styling using ThemeProvider
const theme = createTheme({
	components: {
		MuiTableCell: {
			styleOverrides: {
				root: {
					padding: "10px",
					fontSize: "var(--font-size-large)",
					fontWeight: "var(--font-size-large)",
					fontFamily: "var(--primary-font-family)",
				},
			},
		},
	},
});

const themeHeaderCell = createTheme({
	components: {
		MuiTableCell: {
			styleOverrides: {
				root: {
					paddingLeft: "10px",
					paddingBottom: "10px",
					paddingTop: "0px",
					fontSize: "var(--font-size-large)",
					fontWeight: "bold",
					fontFamily: "var(--primary-font-family)",
				},
			},
		},
	},
});

// defines the status icon definitions based on rankCutoff configured
const upperLimit = semVerFromString(config.rankCutoff.major);
const lowerLimit = semVerFromString(config.rankCutoff.minor);

// defines red, yellow and green traffic light descriptions
export const redDef = new VersionDefinition(
	`Current major version behind by more than 1 major or ${upperLimit.minor} minors.`
);
export const yellowDef = new VersionDefinition(
	`Current minor version behind by ${lowerLimit.minor} or ${upperLimit.minor} minors.`
);
export const greenDef = new VersionDefinition(
	`Current minor version behind by less than ${lowerLimit.minor} minors.`
);

// creates the table for the status definitions
function StatusTable() {
	return (
		<TableContainer>
			<Table size="medium" className={styles.tableStyle}>
				<TableHead>
					<TableRow>
						<ThemeProvider theme={themeHeaderCell}>
							<TableCell className={styles.tableHeaderCellStyle}>
								Status
							</TableCell>
							<TableCell className={styles.tableHeaderCellStyle}>
								Definition
							</TableCell>
						</ThemeProvider>
					</TableRow>
				</TableHead>
				<TableBody>
					<ThemeProvider theme={theme}>
						<TableRow>
							<TableCell className={styles.tableCellStyle}>
								<Image
									src={redIcon}
									alt="Highly out-of-date"
									width="40px"
									height="40px"
								></Image>
							</TableCell>
							<TableCell className={styles.tableCellStyle}>
								<p>{redDef.description}</p>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className={styles.tableCellStyle}>
								<Image
									src={yellowIcon}
									alt="Moderately out-of-date"
									width="40px"
									height="40px"
								></Image>
							</TableCell>
							<TableCell className={styles.tableCellStyle}>
								<p>{yellowDef.description}</p>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className={styles.tableCellStyle}>
								<Image
									src={greenIcon}
									alt="Up to date"
									width="40px"
									height="40px"
								></Image>
							</TableCell>
							<TableCell className={styles.tableCellStyle}>
								<p>{greenDef.description}</p>
							</TableCell>
						</TableRow>
					</ThemeProvider>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

// assembles the pop-up for the light status help
export default function HelpScreen(props: HelpScreenProps) {
	return (
		<div className={styles.modalBg}>
			<div className={styles.modalContainer}>
				<div className={styles.crossButtonContainer}>
					<IconButton
						aria-label="Close button"
						className={styles.closeHelpScreen}
						onClick={() => props.closeHelp(false)}
					>
						<Image
							className={styles.closeBtn}
							width="40"
							height="40"
							alt="Cross icon"
							src={closeIcon}
						/>
					</IconButton>
				</div>
				<div>
					<StatusTable />
				</div>
			</div>
		</div>
	);
}
