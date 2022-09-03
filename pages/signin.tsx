import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import { Button, CircularProgress, Grid, Paper, Typography, Link, Box, Alert, AlertTitle } from "@mui/material";
import styles from "../styles/signin.module.css";
import { GitHubIcon } from "../components/GitHubIcon";
import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import TrafficIcon from '@mui/icons-material/Traffic';


const client_id = "5cd550d6a19995e8faf0";
const scope = "repo:read"
const redirect_uri = "http://localhost:3000/signin/";

// get code
function redirect() {
	//! TODO: research secure ways to generate it
	const random_state = (Math.random() + 1).toString(36);
	window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${random_state}`;
}

type SignInStatus = "calculating" | "not-signed-in" | "exchanging-code-for-token" | "signed-in" | "error-while-signing-in"



export default function SignIn() {

	const router = useRouter()

	const [token, setToken] = useState<string>('');

	const [signInStatus, setSignInStatus] = useState<SignInStatus>("calculating")

	const [errorMessage, setErrorMessage] = useState<string>()

	// example of url after redirecting to the callback url
	// http://localhost:3000/?code=${client_id}&state=${random_state}
	useEffect(() => {
		setErrorMessage(undefined as any)

		if (router == null) {
			return
		}

		//TODO: account for when the user does not consent and other possible errors
		const code = router.query.code?.toString()
		const error = router.query.error?.toString()

		if (error != null) {
			setSignInStatus('error-while-signing-in')
			//setSignInMessage("Whatever")
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
					<Typography variant="body1">You can read <Link href="https://github.com/ahm-monash/evergreen/documentation/oauth-scope.md">our documentation</Link> on OAuth scopes to see why we request certain OAuth scopes.</Typography>

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
