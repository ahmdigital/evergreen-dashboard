import { Collapse, Divider, Grid, IconButton, Typography } from "@mui/material"
import { useState } from "react"
import { ProcessedDependencyData } from "../../../hooks/useProcessDependencyData"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SemVerFormatter } from "../../SemVerFormatter";
import { StatusIcon } from "../../StatusIcon";
import { Box } from "@mui/system";
import { GridSubRow } from "./GridSubRow";
// import dayjs from 'dayjs';

const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const rowTextSX = {
	fontWeight: "var(--font-weight-semibold)",
	fontSize: "18px",
	fontFamily: 'var(--secondary-font-family)',
	backgroundColor: "var(--colour-container-background)",
	color: "var(--colour-font)",
}

type GridRowProps = {
	row: ProcessedDependencyData[0]
}

export function GridRow(props: GridRowProps) {


	const [isOpen, setIsOpen] = useState(false)

	return <>
		<Box sx={{ p: { xs: 0.5, md: 1.5 } }}>
			<Grid container wrap="nowrap" columnSpacing={2} alignItems='center'>
				{/* Arrow icon */}
				<Grid item xs={'auto'}>
					<IconButton
						aria-label="Expand row"
						size="small"
						onClick={() => setIsOpen(!isOpen)}
						sx={{ color: 'gray' }}
					>
						{isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
					</IconButton>
				</Grid>

				{/* Rank */}
				<Grid item xs='auto' style={{ paddingLeft: '3px' }} >
					<StatusIcon rank={props.row.minRank} />
				</Grid>

				{/* Name */}
				<Grid item xs sx={{ overflowWrap: "anywhere" }}>
					<Typography sx={{ ...rowTextSX }} >
						<a href={props.row.link} rel="noreferrer" target="_blank">
							{props.row.name}
						</a>
					</Typography>
				</Grid>

				{/* Name */}
				<Grid item xs sx={{ overflowWrap: "anywhere" }}>
					<Typography sx={{ ...rowTextSX }} >
						{props.row.oldName ? props.row.oldName.substr(0, props.row.oldName.lastIndexOf('(')) : ""}
					</Typography>
				</Grid>

				{/* Version */}
				<Grid item xs='auto' md={2}>
					<Typography sx={rowTextSX}>
						<SemVerFormatter semver={props.row.version} />
					</Typography>
				</Grid>

				{/* Last updated */}
				<Grid item md={2} sx={{ display: { xs: 'none', md: 'initial' } }}>
					<Typography sx={rowTextSX}>{dayjs(props.row.lastUpdated).fromNow()}</Typography>
				</Grid>


			</Grid>
		</Box>
		<Divider />
		<Collapse in={isOpen} timeout="auto" unmountOnExit>

			<GridSubRow
				internal={props.row.internalSubRows}
				external={props.row.externalSubRows}
				users={props.row.userSubRows}
			/>

		</Collapse>
		{isOpen && <Divider />}

	</>
}
