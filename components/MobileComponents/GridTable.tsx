import { Collapse, Divider, Grid, IconButton, Typography } from "@mui/material"
import { useState } from "react"
import { ProcessedDependencyData } from "../../hooks/useProcessDependencyData"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SemVerFormatter } from "../SemVerFormatter";
import { StatusIcon } from "../StatusIcon";
import { Box } from "@mui/system";
const dayjs = require('dayjs')

const tableHeaderTextSX = {
	fontWeight: "var(--font-weight-semibolder)",
	fontSize: "var(--font-size-large)",
	fontFamily: 'var(--primary-font-family)',
	backgroundColor: "var(--table-cell-background)",
	color: "var(--colour-font)",
	marginTop: '1rem',
	lineHeight: '3rem',
	borderColor: "var(--table-cell-border)",
	borderWidth: '0.2rem'
}

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
				<Grid item xs='auto' style={{paddingLeft: '3px'}} >
					<StatusIcon rank={props.row.minRank} />
				</Grid>

				{/* Name */}
				<Grid item xs sx={{overflowWrap: "anywhere"}}>
					<Typography  sx={{...rowTextSX }} >
						{props.row.name}
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

			Hello

		</Collapse>
		{isOpen && <Divider />}

	</>
}

type GridTableProps = {
	rows: ProcessedDependencyData
}

export function GridTable(props: GridTableProps) {


	return <Box >

		<Grid container>
			<Grid item xs='auto'>
				<Typography sx={{
					width: {
						xs: '96px',
						sm:'76px',
					}, 
					paddingLeft: {
						xs: '0px',
						sm: '20px',
					},
					 ...tableHeaderTextSX
					}}>status&nbsp;</Typography>
			</Grid>
			<Grid item xs >
				<Typography sx={tableHeaderTextSX}>name</Typography>
			</Grid>
			<Grid item xs='auto' md={2}>
				<Typography sx={tableHeaderTextSX}>version</Typography>
			</Grid>
			<Grid item md={2} sx={{ display: { xs: 'none', md: 'initial' } }}>
				<Typography sx={tableHeaderTextSX}>last push</Typography>
			</Grid>
		</Grid>

		<hr style={{ backgroundColor: 'black', height: '2px' }} />

		{
			props.rows?.map((row, index) => <GridRow row={row} key={index} />)
		}
	</Box>
}