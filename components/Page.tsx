import CollapsibleTable from "./CollapsibleTable";
import Head from "next/head";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Layout from "./Layout";
import styles from "../components/treeView.module.css";
import { DependencyData } from "../src/dataProcessing";
import { useProcessDependencyData } from "../hooks/useProcessDependencyData";
import Row from "./Row";
import { SubRow } from "./SubRow";
import { InverseSubRow } from "./InverseSubRow";

export type PageProps = {
	JSObject: DependencyData;
	finalData: boolean
};

export default function Page(props: PageProps) {
	let loadingWheel: any = null;
	if (!props.finalData) {
		loadingWheel = <Box sx={{ display: "inline-block", float: "right", justifyContent: 'center', alignItems: 'center', width: "10vh" }}>
			<CircularProgress />
		</Box>
	}

	const rows = useProcessDependencyData(props.JSObject);

	return (
		<div className="container">
			<Head>
				<title>Evergreen dashboard</title>
			</Head>
			<main style={{ padding: 0 }}>
				<Layout>
					<div className={styles.topBarStyle}>
						<h1
							className="title"
							style={{
								padding: "0 32px",
								fontWeight: 600,
								color: "var(--colour-font)",
								width: "10vh",
								display: "inline-block"
							}}
						>
							evergreen
						</h1>
						{loadingWheel}
					</div>
				</Layout>
				<Layout>
					<div className={styles.barStyle}>
						<CollapsibleTable>
							{
								rows.map(row => <Row
									key={row.name}
									rank={row.minRank}
									row={row}
									subRows={{
										internal: row.internalSubRows.map(i => <SubRow key={i.name} dependency={i} />),
										external: row.externalSubRows.map(i => <SubRow key={i.name} dependency={i} />),
										user: row.userSubRows.map(i => <InverseSubRow key={i.name} user={i} />),
										final: row.userSubRows.length === 0,
									}}
								/>)
							}
						</CollapsibleTable>;
					</div>
				</Layout>
			</main>
		</div>
	);
}
