// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import path from 'path'
import fs from 'fs'
import configFile from "./config.json";


// expiry is set to the time that the token will in the future
// so if the token is request at 09:00, expiry will be set to 17:00 (after 8 hours since 09:00 )
// https://docs.github.com/en/developers/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps#response
type TokenCookie = {
	accessToken: string
	accessTokenExpiry: number
	refreshToken: string
	refreshTokenExpiry: number
}

// default github api expiry values 
// TODO: these values should be extracted from the response on the frontend and send to the server
const tokenLifetimeSeconds = 28800
const refreshTokenLifetimeSeconds = 15811200


function encodeBase64(input:string):string{
	return Buffer.from(input).toString("base64")
}

function decodeBase64(input:string):string{
	return Buffer.from(input, "base64").toString("ascii")
}

function encodeTokenCookie(token:TokenCookie):string{
	return encodeBase64(JSON.stringify(token))
}

function decodeTokenCookie(token:string):TokenCookie{
	return JSON.parse(decodeBase64(token)) as TokenCookie
}



// This function can be marked `async` if using `await` inside
export async function CheckAuthenticationBeforeServingData(request: NextRequest) {
	
	if(configFile.requireAuthentication == false){
		return NextResponse.next()
	}

	const tokenString = request.cookies.get("tokens")
	if (tokenString == null) {
		return NextResponse.json({ message: 'Authentication is required' }, { status: 401 })
	}
	try{

		const tokenCookie = decodeTokenCookie(tokenString)

		const goToNextHandler = NextResponse.next()

		// if the token expires in less than 1 hour, then we need to request a new one, 
		// becuase we don't won't to run into the risk of expired token in the middle 
		// of fetching data from github api 
		if(tokenCookie.accessTokenExpiry - Date.now()/1000 < 3600 ){
			//access token expired
			if(tokenCookie.refreshTokenExpiry < Date.now()/1000){
				//refresh token expired
				//TODO: handle this in the frontend, or at some point it will stop working
				return NextResponse.json({ message: 'Reauthenticate' }, { status: 401 })
			}

			//TODO: refresh the token
			//e.g. const newToken = await refreshToken(token.refreshToken)
			
			tokenCookie.accessToken = "newToken"
			tokenCookie.accessTokenExpiry = Date.now()/1000 + newToken.tokenLifetimeSeconds
			tokenCookie.refreshTokenExpiry = Date.now()/1000 + newToken.refreshTokenLifetimeSeconds

			goToNextHandler.cookies.set("tokens", encodeTokenCookie(tokenCookie), {
				httpOnly: true,
				maxAge: tokenCookie.refreshTokenExpiry - Date.now()/1000,
				sameSite: 'strict',
				secure: true
			})
			
		}


		const username = await getUsername(tokenCookie.accessToken)

		const isMember = await isOrganisationMember(configFile.targetOrganisation, username, tokenCookie.accessToken)

		if(!isMember){
			return NextResponse.json({ message: 'Not a member' }, { status: 401 })
		}

		return goToNextHandler
	}catch(error){
		console.log("Error while validating token: " + error)
		return NextResponse.json({ message: 'Auth required' }, { status: 401 })
	}
}

async function refreshToken(refreshToken: string) : string {
	// TODO
	return ""
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


// See "Matching Paths" below to learn more
export const config = {
	matcher: ['/api/loadLatest/', '/api/loadNew/', '/api/forceNew']
}
