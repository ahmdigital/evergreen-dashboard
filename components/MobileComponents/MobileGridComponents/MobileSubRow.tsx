import { Divider, Grid, Typography } from "@mui/material";
import { PackageData } from "../../../hooks/useProcessDependencyData";
import { SemVerFormatter } from "../../SemVerFormatter";
import { StatusIcon } from "../../StatusIcon";


const subRowTextSX = {
	fontFamily: "var(--secondary-font-family)",
	fontSize: "1rem",
	backgroundColor: "#f5f5f5",
	color: "var(--colour-font)",
	borderColor: "#7a7a7a",
}

type SubRowProps = {
	data: PackageData
	forUsers: boolean
}

export function SubRow(props: SubRowProps) {
	const { data, forUsers } = props
	return <>
		<Grid
			wrap="nowrap"
			columnSpacing={2}
			alignItems='center'
			sx={{ py: 1 }}
			container>

			{/* Status */}
			<Grid item xs="auto">
				<StatusIcon rank={data.rank} variant="small" />
			</Grid>

			{/* Name */}
			<Grid item xs sx={{ overflowWrap: "anywhere" }}>
				<Typography sx={subRowTextSX}>
					<a href={data.link} rel="noreferrer" target="_blank">
						{data.name}
					</a>
				</Typography>
			</Grid>

			{/* Current */}
			<Grid item xs={3} sm={2} >
				<Typography sx={subRowTextSX}>
					<SemVerFormatter semver={forUsers ? data.version : data.usedVersion} />
				</Typography>
			</Grid>

			{/* Latest */}
			{
				!forUsers && <Grid item xs={3} sm={2}>
					<Typography sx={subRowTextSX}>
						<strong>
							<SemVerFormatter semver={data.version} />
						</strong>
					</Typography>
				</Grid>
			}

		</Grid>
		<Divider sx={{ borderColor: "#7a7a7a" }} />
	</>
}