import { useState, useEffect } from "react";
import {useRouter} from "next/router"

type AuthResponse = {
  access_token: string;
  scope: string;
  token_type: string;
};

const client_id = process.env.CLIENT_ID;

const redirect_uri = "http://localhost:3000/";

// get code
function redirect() {
	//! TODO: research secure ways to generate it
  	const random_state = (Math.random() + 1).toString(36);
  	window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=repo:read&state=${random_state}`;
}

type SignInStatus = "calculating" | "not-signed-in" | "exchanging-code-for-token" | "signed-in" | "error-while-signing-in"

/**
 * Check if user is signed in by looking at any stored tokens
 */
function isSignedIn(){
	//TODO: read and check token
	return false
}

/**
 * Signs the user in by validating the token and storing it. Throws an error if the token is invalid.
 */
function signIn(token:string){
	//TODO: validate and store token
}

export default function SignIn() {

	const router = useRouter()

	const [token, setToken] = useState<string>('');

	const [signInStatus, setSignInStatus] = useState<SignInStatus>("calculating")

	// example of url after redirecting to the callback url
	// http://localhost:3000/?code=${client_id}&state=${random_state}
	useEffect(() => {

		if (router == null){
			return
		}

		if(isSignedIn()){
			setSignInStatus('signed-in')
			return
		}

		router.push({})

		//TODO: account for when the user does not consent and other possible errors
		const code = router.query.code?.toString()

		if(code != null){
			setSignInStatus('exchanging-code-for-token')
			console.log(`code ${code}`);

			//This immediately called function must be defined because useEffect handlers cannot be async
			const getToken = async () => {
				const response: Response = await fetch(`/api/authenticate/${encodeURIComponent(code.toString())}/`);
				console.log(`response ${response}`);
				const responseObj: AuthResponse = await response.json();
				console.log(`token ${responseObj}`);
				console.log(`token ${responseObj.access_token}`);
				setToken(responseObj.access_token);
			};
			getToken()
				.catch((error) => {
					console.log("error while exchanging token", error)
					setSignInStatus('error-while-signing-in')
				});
		}
	}, [router]);

	useEffect(() => {
		if(signInStatus === 'exchanging-code-for-token'){
			try{
				signIn(token)
				setSignInStatus('signed-in')
			}catch(error){
				console.log("Error while validating token", error)
				setSignInStatus('error-while-signing-in')
			}
		}
	}, [token])

	return (
		<>
		<button onClick={redirect}>Login</button>

		<p>Token: {token?.slice(10)}</p>

		{
			signInStatus === "calculating" && <></>
		}
		{
			signInStatus === "not-signed-in" && <></>
		}
		{
			signInStatus === "exchanging-code-for-token" && <></>
		}
		{
			signInStatus === "error-while-signing-in" && <></>
		}
		{
			signInStatus === "signed-in" && <></>
		}
		</>
  	);
}
