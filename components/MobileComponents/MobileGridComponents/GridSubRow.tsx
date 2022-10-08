import { Grid, Typography } from "@mui/material"
import { ReactNode } from "react"
import { PackageData } from "../../../hooks/useProcessDependencyData"
import { Box } from "@mui/system";
import Tabs from "../../ReposTableComponents/Tabs";
import { SubRow } from "./MobileSubRow";


const subRowHeaderTextSX = {
	fontWeight: "var(--font-weight-semibolder)",
	fontSize: "var(--font-size-normal)", //16px
	fontFamily: 'var(--primary-font-family)',
	backgroundColor: "#f5f5f5",
	color: "var(--colour-font)",
	marginTop: '1rem',
	lineHeight: '3rem',
	borderColor: "#CECECE",
	borderWidth: '0.2rem'
}

type GridSubRowProps = {
	internal: PackageData[]
	external: PackageData[]
	users: PackageData[]
}

export function GridSubRow(props: GridSubRowProps) {
	
	return <>
		<Box sx={{ backgroundColor: "#f5f5f5" }}>
			<Tabs subRows={{
				internal: props.internal.map((data, i) => <SubRow key={i} data={data} forUsers={false} />),
				external: props.external.map((data, i) => <SubRow key={i} data={data} forUsers={false} />),
				user: props.users.map((data, i) => <SubRow key={i} data={data} forUsers={true} />),
				final: false
			}}
				tableFunc={(elem: ReactNode, variant: "dependency" | "user") => {
					return <Box sx={{ px: 2, maxHeight: '400px', overflow: 'auto' }}>
						<Grid container columnSpacing={2} >

							<Grid item>
								<Typography sx={subRowHeaderTextSX} >status&nbsp;</Typography>
							</Grid>
							<Grid item xs>
								<Typography sx={subRowHeaderTextSX} >name</Typography>
							</Grid>
							<Grid item xs={3} sm={2}>
								<Typography sx={subRowHeaderTextSX}>current</Typography>
							</Grid>
							{
								variant === "dependency" &&
								<Grid item xs={3} sm={2}>
									<Typography sx={subRowHeaderTextSX}>latest</Typography>
								</Grid>
							}
						</Grid>

						<hr style={{ backgroundColor: 'rgb(206 206 206)', height: '4px', border: 'none', margin: '0' }} />

						{elem}

					</Box>
				}} />
		</Box>
	</>
}