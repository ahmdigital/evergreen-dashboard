import { Button, Modal, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Component } from "react";

type ErrorBoundaryState = {
	hasError: boolean;
};

type ErrorBoundaryProps = {
	children: React.ReactNode;
	//Component to display when there is an error
	errorComponent: React.ReactNode;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps> {
	state: ErrorBoundaryState;

	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: any) {
		// You can also log the error to an error reporting service
		console.log("Recoved from error", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return this.props.errorComponent;
		}

		return this.props.children;
	}
}

type CatchAllErrorsProps = {
	children: React.ReactNode;
};

export function CatchAllErrors(props: CatchAllErrorsProps) {
	return (
		<ErrorBoundary
			errorComponent={
				<Modal
					open={true}
					aria-labelledby="catchall-modal-title"
					aria-describedby="catchall-modal-description"
				>
					<Box
						sx={{
							position: "absolute" as "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: 400,
							backgroundColor:
								"var(--colour-container-background)",
							boxShadow: 24,
							border: "none",
							borderRadius: "var(--label-border-radius)",
							p: 4,
						}}
					>
						<Typography
							id="catchall-modal-title"
							variant="h6"
							component="h2"
						>
							Unexpected error detected!
						</Typography>
						<Typography
							id="catchall-modal-description"
							sx={{ mt: 2 }}
						>
							An unexpected error has occurred, please try again
							later.
						</Typography>

						<Stack
							justifyContent={"end"}
							direction="row"
							spacing={2}
							sx={{ mt: 2 }}
						>
							<Button
								variant="contained"
								onClick={() => window.location.reload()}
							>
								Reload Page
							</Button>
						</Stack>
					</Box>
				</Modal>
			}
		>
			{props.children}
		</ErrorBoundary>
	);
}
