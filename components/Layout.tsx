import { Box } from "@mui/material";
import { PropsWithChildren } from "react";
import styles from "../styles/Layout.module.css";

export default function Layout(props: PropsWithChildren<{}>) {
  return (
    <>
      <Box component='main' sx={{paddingX: {
		xs: 2,
		md: '10%'
	  }}} className={styles.main} aria-label='Evergreen Dashboard'>{props.children}</Box>
    </>
  );
}
