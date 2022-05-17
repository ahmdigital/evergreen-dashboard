import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Circle } from "@mui/icons-material";
import { rankToDepColour, semVerToString } from "./semVer";
import { PackageData } from "../hooks/useProcessDependencyData";

export type SubRowProps = {
	dependency: PackageData;
};
// Creates the collapsible rows for internal/external dependencies

export function SubRow(props: SubRowProps) {
	// dependencyData contains all the packages and its props (name, version, link etc)
	const str = props.dependency.name +
		": " +
		semVerToString(props.dependency.usedVersion) +
		" -> " +
		semVerToString(props.dependency.version);
	const [colour, borderColour, colourIndex] = rankToDepColour(props.dependency.rank);
	return (
		<TableRow style={{ backgroundColor: "var(--colour-background)", color: "var(--colour-font)" }}>
			<col style={{ width: "0%" }} />
			<col style={{ width: "75%" }} />
			<TableCell>
				<Circle style={{ color: colour }} />
			</TableCell>
			<TableCell style={{ backgroundColor: "var(--colour-background)", color: "var(--colour-font)" }}>{str}</TableCell>
		</TableRow>
	);
}
