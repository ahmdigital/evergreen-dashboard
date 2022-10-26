import { Box } from "@mui/material";
import { ReactNode } from "react";
import styles from "../styles/Layout.module.css";

type LayoutProps = {
	children: ReactNode;
};

export default function Layout(props: LayoutProps) {
	return (
		<>
			<Box
				component="main"
				sx={{
					paddingX: {
						xs: 2,
						md: "10%",
					},
				}}
				className={styles.main}
				aria-label="Evergreen Dashboard"
			>
				{props.children}
			</Box>
		</>
	);
}
