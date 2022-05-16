import React, { useEffect } from 'react'
import makeCollapsibleTable from './CollapsibleTable'
import Head from 'next/head';
import Layout from './layout';
import styles from '../components/treeView.module.css';
import { DependencyData } from './dataProcessing';

export type PageProps = {
	JSObject: DependencyData
}


export function Page(props: PageProps) {

	return (
		<div className="container">
			<Head>
				<title>Evergreen dashboard</title>
			</Head>
			<main style={{ padding: 0}}>
				<Layout>
					<div className={styles.topBarStyle}>
						<h1 className="title" style={{ padding: "0 32px", fontWeight: 600, color: "var(--colour-font)" }}>
							evergreen
						</h1>
					</div>
				</Layout>
				<Layout>
					<div className={styles.barStyle}> {makeCollapsibleTable(props.JSObject)} </div>
				</Layout>
			</main>
		</div>
	);
}
