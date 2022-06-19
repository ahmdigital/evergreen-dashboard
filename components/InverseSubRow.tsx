import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Circle } from "@mui/icons-material";
import { rankToDepColour, semVerToString } from "../src/semVer";
import { SubRowProps } from "./SubRow";

type InverseSubRowProps = {
	//This is just renaming dependency to user to make it more clear
	user: SubRowProps['dependency'];
};

export function InverseSubRow(props: InverseSubRowProps) {
	const str = props.user.name + ": " + semVerToString(props.user.version);
	const colour = rankToDepColour(props.user.rank)[0];
	return (
		<TableRow style={{ backgroundColor: "var(--colour-background)", color: "var(--colour-font)" }}>
			<TableCell>
				<Circle style={{ color: colour }} />
			</TableCell>
			<TableCell style={{ backgroundColor: "var(--colour-background)", color: "var(--colour-font)" }}>{str}</TableCell>
		</TableRow>
	);
}
