import { ReactNode } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

type CollapsibleTableProps = {
	children: ReactNode	//ment to be a list of rows
}

// Creates the whole table
export default function CollapsibleTable(props: CollapsibleTableProps){
	return (
		<div>
			<TableContainer component={Paper} style={{ backgroundColor: "var(--colour-background)", color: "var(--colour-font)" }}>
				<Table size="small" aria-label="collapsible table">
					<colgroup>
						<col style={{ width: "0%", backgroundColor: "var(--table-left-edge)" }} />
						<col style={{ width: "0%", backgroundColor: "var(--colour-background)" }} />
						<col style={{ width: "75%", backgroundColor: "var(--colour-background)" }} />
						<col style={{ width: "25%", backgroundColor: "var(--colour-background)" }} />
						<col style={{ width: "0%", backgroundColor: "var(--colour-background)" }} />
					</colgroup>
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							<TableCell></TableCell>
							<TableCell style={{ color: "var(--colour-text)" }}>Name</TableCell>
							<TableCell style={{ color: "var(--colour-text)" }}>Version</TableCell>
							<TableCell style={{ color: "var(--colour-text)" }}>Link</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>{props.children}</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};
