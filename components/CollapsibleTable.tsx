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

import {ID, DependencyData, DependencyMap, DependencyListSingleDep, findRank, rankToDepColour, semVerToString, SemVer} from "./dataProcessing"

// Creates the whole table based on sample data 
const CollapsibleTable = (rows: JSX.Element[]) => {
	return (
		<div>
			<TableContainer component={Paper}>
				<Table size="small" aria-label="collapsible table">
					<colgroup>
						<col style={{width:"0%", backgroundColor: "#f6f6f6"}}/>
						<col style={{width:"75%"}}/>
						<col style={{width:"25%"}}/>
						<col style={{width:"0%"}}/>
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

function makeSubRow(data: DependencyListSingleDep, rank: number, dependencyMap: DependencyMap){
	const dependencyData = dependencyMap.get(data.id)
	const str = dependencyData.name + ": " + semVerToString(data.version) + ' -> ' + semVerToString(dependencyData.version)
	const [colour, borderColour, colourIndex] = rankToDepColour(rank);
	const dep = (
		<div style={{ backgroundColor: colour, padding: 5, border: borderColour }}>
			{str}
		</div>
	);
	return dep
}

function makeInverseSubRow(data: DependencyListSingleDep, rank: number, dependencyMap: DependencyMap){
	const dependencyData = dependencyMap.get(data.id)
	const str = dependencyData.name + ": " + semVerToString(data.version)
	const [colour, borderColour, colourIndex] = rankToDepColour(rank);
	const dep = (
		<div style={{ backgroundColor: colour, padding: 5, border: borderColour }}>
			{str}
		</div>
	);
	return dep
}

const makeCollapsibleTable = (JSObject: DependencyData) => {
	//TODO: Rather than taking in the raw objet, take a structure that can be directly converted into JSX
	let rowList: JSX.Element[] = []

	for(const dep of JSObject.deps){
		const data = JSObject.depMap.get(dep.id);
		let internalSubRows: JSX.Element[] = []
		let externalSubRows: JSX.Element[] = []
		let userSubRows: JSX.Element[] = []
		
		let minRank = 2

		for(const i of dep.dependencies){
			const iData = JSObject.depMap.get(i.id);
			const rank = findRank(i.version, iData.version);

			const depData = JSObject.depMap.get(i.id);
			if(depData.internal){
				internalSubRows.push(makeSubRow(i, rank, JSObject.depMap))
			} else{
				externalSubRows.push(makeSubRow(i, rank, JSObject.depMap))
			}

			minRank = rank < minRank ? rank : minRank
		}

		for(const i of dep.users){
			const rank = findRank(i.version, data.version);

			userSubRows.push(makeInverseSubRow(i, rank, JSObject.depMap))
		}

		rowList.push(<Row
			key={data.name}
			rank={minRank}
			row={data}
			subRows = {{
				internal: internalSubRows,
				external: externalSubRows,
				user: userSubRows,
				final: dep.users.length == 0	
			}}			
		/>)
	}
	return CollapsibleTable(rowList)
}

export default makeCollapsibleTable;
