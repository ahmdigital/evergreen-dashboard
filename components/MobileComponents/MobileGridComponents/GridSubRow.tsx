import { PackageData } from "../../../hooks/useProcessDependencyData"
import { Box } from "@mui/system";
import Tabs from "../../ReposTableComponents/Tabs";
import { SubRow } from "./MobileSubRow";
import { ReactNode, useMemo } from "react";
import React from "react";

type GridSubRowProps = {
	internal: PackageData[]
	external: PackageData[]
	users: PackageData[]
}

export function GridSubRow(props: GridSubRowProps) {
		return <>
		<Box sx={{ backgroundColor: "#f5f5f5" }}>
			{console.log("mapping again")}
			<Tabs subRows={{
				internal: props.internal.map((data, i) => <SubRow key={i} data={data} forUsers={false} />),
				external: props.external.map((data, i) => <SubRow key={i} data={data} forUsers={false} />),
				user: props.users.map((data, i) => <SubRow key={i} data={data} forUsers={true} />),
				final: false
			}}/>
		</Box>
	</>
}
