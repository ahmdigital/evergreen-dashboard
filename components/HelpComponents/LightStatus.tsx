import Image from "next/image";
// import getConfig from "next/config";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import closeIcon from "../images/closeIcon.png";
import styles from "../../styles/LightStatus.module.css";
import { LightStatusIconFactory } from "../icons/IconFactory";
import { statusDefinitionsReposSummary, StatusType } from "../constants";

// const { publicRuntimeConfig: config } = getConfig();

export type HelpScreenProps = {
	closeHelp: (_value: boolean | ((_prev: boolean) => boolean)) => void;
};

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

const ICON_SIZE = "40px";

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
								<LightStatusIconFactory
									toolTip={false}
									type={StatusType.RED}
									iconSize={ICON_SIZE}
								/>
							</TableCell>
							<TableCell className={styles.tableCellStyle}>
								<p>
									{
										statusDefinitionsReposSummary[
											StatusType.RED
										]
									}
								</p>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className={styles.tableCellStyle}>
								<LightStatusIconFactory
									toolTip={false}
									type={StatusType.YELLOW}
									iconSize={ICON_SIZE}
								/>
							</TableCell>
							<TableCell className={styles.tableCellStyle}>
								<p>
									{
										statusDefinitionsReposSummary[
											StatusType.YELLOW
										]
									}
								</p>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className={styles.tableCellStyle}>
								<LightStatusIconFactory
									toolTip={false}
									type={StatusType.GREEN}
									iconSize={ICON_SIZE}
								/>
							</TableCell>
							<TableCell className={styles.tableCellStyle}>
								<p>
									{
										statusDefinitionsReposSummary[
											StatusType.GREEN
										]
									}
								</p>
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
