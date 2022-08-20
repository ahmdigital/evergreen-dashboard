import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import { Button, CircularProgress, Grid, Paper, Typography, Link, Box, Alert, AlertTitle } from "@mui/material";
import styles from "../styles/signin.module.css";
import { GitHubIcon } from "../components/GitHubIcon";
import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import TrafficIcon from '@mui/icons-material/Traffic';

type AuthResponse = {
	access_token: string;
	scope: string;
	token_type: string;
};

const client_id = "5cd550d6a19995e8faf0";

const redirect_uri = "http://localhost:3000/";

// get code
function redirect() {
	//! TODO: research secure ways to generate it
	const random_state = (Math.random() + 1).toString(36);
	window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=repo:read&state=${random_state}`;
}

type SignInStatus = "calculating" | "not-signed-in" | "exchanging-code-for-token" | "signed-in" | "error-while-signing-in"

let ID = {
	isSignedIn: false,
	token: '',
	username: ''
}
/**
 * Check if user is signed in by looking at any stored tokens
 */
function isSignedIn() {
	//TODO: read and check token
	return ID.isSignedIn;
}

/**
 * Signs the user in by validating the token and storing it. Throws an error if the token is invalid.
 */
function signIn(token: string, username: string) {
	//TODO: validate and store token

	if (token != null) {
		throw new Error();
	}
	ID.token = token;
	ID.username = username;
	ID.isSignedIn = true;

}

async function isOrganisationMember(org: string, username: string, authToken: string): Promise<boolean> {
	// const octokit = new Octokit({
	// 	auth: authToken
	// })

	// Make a request to the GitHub api using these headers using the browser fetch
	// -H "Accept: application/vnd.github+json" \ 
	// -H "Authorization: token <TOKEN>" \

	return await fetch(`https://api.github.com/orgs/${org}/members/${username}`, {
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `token ${authToken}`
		}
	}).then(response => {
		return response.json()
	}).then(jsonResponse => {

		if (jsonResponse.status == 204) {
			return true
		}
		else if (jsonResponse.status == 304) {
			console.log(jsonResponse.message)
			return false
		}
		else if (jsonResponse.status == 404) {
			console.log(jsonResponse.message)
			return false
		}
		else {
			// throw exception
			console.log(jsonResponse.message)
			return false
		}
	}).catch(error => {
		console.log(error)
		return false
	})
}

async function getUsername(authToken: string): Promise<string> {
	// const octokit = new Octokit({
	// 	auth: authToken
	// })

	// Make a request to the GitHub api using these headers using the browser fetch
	// -H "Accept: application/vnd.github+json" \ 
	// -H "Authorization: token <TOKEN>" \

	return await fetch(`https://api.github.com/user`, {
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `token ${authToken}`
		}
	}).then(response => {
		return response.json()
	}).then(jsonResponse => {

		if (jsonResponse.status == 200) {
			return jsonResponse.login
		}
		else {
			throw new Error(jsonResponse?.message)
		}
	}).catch(error => {
		console.log(error)
		throw new Error(error)
	})
}

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

		if (isSignedIn()) {
			setSignInStatus('signed-in')
			return
		}

		//TODO: account for when the user does not consent and other possible errors
		const code = router.query.code?.toString()
		const error = router.query.error?.toString()

		if (error != null) {
			setSignInStatus('error-while-signing-in')
		} else if (code != null) {
			setSignInStatus('exchanging-code-for-token')
			console.log(`code ${code}`);

			//This immediately called function must be defined because useEffect handlers cannot be async
			const getToken = async () => {
				const response: Response = await fetch(`/api/authenticate/${encodeURIComponent(code.toString())}/`);
				console.log(`response ${response}`);
				const responseObj: AuthResponse = await response.json();
				console.log(`token ${responseObj}`);
				console.log(`token ${responseObj.access_token}`);
				return responseObj.access_token;
			};
			getToken()
				.then(async token => {
					const username = await getUsername(token)
					return { token, username }
				})
				.then(async ({ token, username }) => {
					//TODO: change ahm-monash
					const isMember = await isOrganisationMember("ahm-monash", username, token)
					if (isMember) {
						try{
							signIn(token, username)
							setSignInStatus('signed-in')
						}catch(error){
							setSignInStatus('error-while-signing-in')
							throw new Error()
						}
					} else {
						setErrorMessage("You must be a member of this organisation")
						throw new Error("Not a member")
					}
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

	// const temp = await accessTokenRes.json()
	// console.log(temp)
	// const response = await octokit.request('GET /orgs/{org}/members/{username}', {
	// 	org: org,
	// 	username: username
	// })

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
