import { ReactNode } from 'react'
import styles from './layout.module.css'

type LayoutProps = {
	children: ReactNode
}

export function Layout(props: LayoutProps) {
	return <>
		<main className={styles.main}>
			{props.children}
		</main>
	</>
}
