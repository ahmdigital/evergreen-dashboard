import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import styles from "./CollapsibleTable.module.css";
import Tabs from "./Tabs";

import Row from "./Row"

// Creates the whole table based on sample data 
const CollapsibleTable = (rows: JSX.Element[]) => {
	return (
		<div>
			<TableContainer component={Paper}>
				<Table size="small" aria-label="collapsible table">
					<colgroup>
						<col style={{width:'0%', backgroundColor: "#f6f6f6"}}/>
						<col style={{width:'75%'}}/>
						<col style={{width:'25%'}}/>
						<col style={{width:'0%'}}/>
					</colgroup>
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Version</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

const makeCollapsibleTable = (JSObject: [Map<number, any>, any] ) => {
	//TODO: Rather than taking in the raw objet, take a structure that can be directly converted into JSX
	return CollapsibleTable( Object.entries(JSObject[0]).map(([id, row]) => (<Row key={row.name} row={row} />)));
};

export default makeCollapsibleTable;
