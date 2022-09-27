import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import { Button, CircularProgress, Grid, Paper, Typography, Link, Box, Alert, AlertTitle } from "@mui/material";
import styles from "../styles/signin.module.css";
import { GitHubIcon } from "../components/GitHubIcon";
import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import TrafficIcon from '@mui/icons-material/Traffic';


const SCOPE = "repo"
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;

// get code
function redirect() {
	const uuid = self.crypto.randomUUID();
	window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${SCOPE}&state=${uuid}`;
}

type SignInStatus = "calculating" | "not-signed-in" | "exchanging-code-for-token" | "signed-in" | "error-while-signing-in"


export default function SignIn() {

	const router = useRouter()

	const [token, setToken] = useState<string>('');

	const [signInStatus, setSignInStatus] = useState<SignInStatus>("calculating")

	const [errorMessage, setErrorMessage] = useState<string>()

	useEffect(() => {
		setErrorMessage(undefined as any)

		if (router == null) {
			return
		}
		const code = router.query.code?.toString()
		const error = router.query.error?.toString()

		if (error != null) {
			setSignInStatus('error-while-signing-in')
			error === "access_denied" && setErrorMessage("You have denied access to your GitHub account. Please try again.")
			error === "not_a_member" && setErrorMessage("You are not a member of the organisation. Please sign in with a different account.")
		} else if (code != null) {
			setSignInStatus('exchanging-code-for-token')
			console.log(`code ${code}`);

			//This immediately called function must be defined because useEffect handlers cannot be async
			const isSignedIn = async () => {
				const response = await fetch(`/api/authenticate/${encodeURIComponent(code.toString())}/`);
				if (response.status == 200) {
					return true
				}

				throw await response.json()
			};
			isSignedIn()
				.then(async () => {
					setSignInStatus('signed-in')
				})
				.catch((error) => {

					console.log("error while exchanging token", error)
					setSignInStatus('error-while-signing-in')
					error?.message && setErrorMessage(error.message)

				});

		} else {
			setSignInStatus('not-signed-in')
		}

	}, [router]);

	/**
	 * Called when the user clicks the Try Again button after an error occurred
	 */
	function handleTryAgain() {
		router.push("/signin")
	}


	return (
		<>
			{/* <button onClick={redirect}>Login</button> */}
			<Grid container className={styles.signinPage} justifyContent='center' alignContent='center'>
				<Paper className={styles.signinContainer}>
					{/* TODO: evergreen dashborad logo, we are aming for this design https://gitter.im/ */}
					<Typography variant="h5" component="h1"><span className={styles.everGreen}>Evergreen Dashboard</span> </Typography>
					{/* TODO: add documentation URL */}
					<Typography variant="body1">You can read <Link href="#">our documentation</Link> on OAuth scopes to see why we request certain OAuth scopes.</Typography>

					{
						signInStatus === "calculating" && <>
							<Box sx={{ py: 10 }}>
								<CircularProgress />
							</Box>
						</>
					}
					{
						signInStatus === "not-signed-in" && <>

							<Box sx={{ py: 10 }}>
								<Button
									variant="contained"
									size="large"
									className={styles.signinWithGithubButton}
									onClick={redirect}
									startIcon={<GitHubIcon />}
								>Sign In With GitHub</Button>
							</Box>
						</>
					}
					{
						signInStatus === "exchanging-code-for-token" && <>
							<Box sx={{ py: 5 }}>
								<LoadingButton
									loading

									variant="outlined"
								>
									Almost done
								</LoadingButton>
							</Box>
						</>
					}
					{
						signInStatus === "error-while-signing-in" && <>
							<Alert severity="error">
								<AlertTitle>Error</AlertTitle>
								{
									errorMessage
										? errorMessage
										: "Whoops! There was an error while trying to sign you in."
								}
							</Alert>
							<Button onClick={handleTryAgain}>Try Again</Button>
						</>
					}
					{
						signInStatus === "signed-in" && <>
							<Alert severity="success">
								<AlertTitle>Hi { }</AlertTitle>
								You have successfully signed in!
							</Alert>
							<Button variant="contained"
								size="large"
								endIcon={<TrafficIcon />}
								href="/">Continue to the dashboard</Button>
						</>
					}
				</Paper>
			</Grid>
		</>
	);
}
