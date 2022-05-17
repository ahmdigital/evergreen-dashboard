import React, { useEffect } from 'react'
import { CollapsibleTable } from './CollapsibleTable'
import { InverseSubRow } from "./InverseSubRow";
import { SubRow } from "./SubRow";
import Head from 'next/head';
import Layout from './layout';
import styles from '../components/treeView.module.css';
import { DependencyData } from './dataProcessing';
import { useProcessDependencyData } from '../hooks/useProcessDependencyData';
import Row from './Row';

export type PageProps = {
	JSObject: DependencyData
}

export function Page(props: PageProps) {
	const rows = useProcessDependencyData(props.JSObject);

	return (
		<div className="container">
			<Head>
				<title>Evergreen dashboard</title>
			</Head>
			<main style={{ padding: 0 }}>
				<Layout>
					<div className={styles.topBarStyle}>
						<h1 className="title" style={{ padding: "0 32px", fontWeight: 600, color: "var(--colour-font)" }}>
							evergreen
						</h1>
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
