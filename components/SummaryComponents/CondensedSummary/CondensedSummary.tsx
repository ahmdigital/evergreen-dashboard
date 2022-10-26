import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import { LightStatusIconFactory } from "../../icons/IconFactory";
import { statusLabel, StatusType } from "../../constants";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import styles from "../../../styles/CondensedSummary.module.css";
import { LightStatusIconFactory } from "../../icons/IconFactory";
import { statusLabel, StatusType } from "../../constants";

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
	const ICON_SIZE = "30px";

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
		<div className={styles.rootContainer}>
			<div className={styles.topPart}>
				<div className={styles.percentageContainer}>
					<label>Overall:</label>
					<span
						className={`${styles.overall} ${styles.percentage}`}
						style={{ backgroundColor: overallStatusColour() }}
					>
						{overall ? `${overall}%` : "N/A"}
					</span>
				</div>
				<span className={styles.percentageContainer}>
					<label>Target:</label>
					<span
						className={`${styles.percentage}`}
					>{`${target}%`}</span>
				</span>
			</div>
			<Divider />
			<div className={styles.statuses}>
				<div className={styles.status}>
					<label>{red}</label>
					<LightStatusIconFactory
						type={StatusType.RED}
						iconSize={ICON_SIZE}
						toolTip={true}
						toolTipLabel={statusLabel[StatusType.RED]}
					/>
				</div>
				<div className={styles.status}>
					<label>{yellow}</label>
					<LightStatusIconFactory
						type={StatusType.YELLOW}
						iconSize={ICON_SIZE}
						toolTip={true}
						toolTipLabel={statusLabel[StatusType.YELLOW]}
					/>
				</div>
				<div className={styles.status}>
					<label>{green}</label>
					<LightStatusIconFactory
						type={StatusType.GREEN}
						iconSize={ICON_SIZE}
						toolTip={true}
						toolTipLabel={statusLabel[StatusType.GREEN]}
					/>
				</div>
			</div>
		</div>
	);
};

export default function CondensedSummary(props: CondensedRepoSummaryProps) {
	return (
		<Box sx={{ flexGrow: 1 }} className={`${styles.summaryStyle}`}>
			<Summary
				statusValues={props.statusValues}
				overall={props.overall}
				target={props.target}
			/>
		</Box>
	);
}
