import Head from 'next/head'
import styles from './layout.module.css'

export default function Layout({ children }) {
  return (
    <>
      <main className={styles.main}>{children}</main>
    </>
  )
}
