// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import path from 'path'
import fs from 'fs'
import configFile from "./config.json";
import fetch from 'node-fetch';

// GitHub will automatically revoke an OAuth token or personal access token when the token hasn't been used in one year.
// https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation#token-expired-due-to-lack-of-use

export type TokenCookie = {
	accessToken: string
}

function encodeBase64(input: string): string {
	return Buffer.from(input).toString("base64")
}

function decodeBase64(input: string): string {
	return Buffer.from(input, "base64").toString("ascii")
}

export function encodeTokenCookie(token: TokenCookie): string {
	return token.accessToken
}

export function decodeTokenCookie(token: string): TokenCookie {
	return { accessToken: token }
}

// This function can be marked `async` if using `await` inside
export default async function CheckAuthenticationBeforeServingData(request: NextRequest) {
	console.log("Middleware called for: " + request.url)
	if (configFile.requireAuthentication == false) {
		console.log("Granting access to user")
		return NextResponse.next()
	}

	const tokenString = request.cookies.get("token")
	if (tokenString == null) {
		console.log("Token not present")
		return NextResponse.redirect("localhost:3000/signing?error=Login required")
		// return NextResponse.json({ message: 'Login required' }, { status: 401 })
	}
	try {

		console.log("tokenString:", tokenString)
		const tokenCookie = decodeTokenCookie(tokenString)
		console.log("tokenCookie:", tokenCookie)

		const username = await getUsername(tokenCookie.accessToken)
		console.log("Username:", username)
		
		console.log(`Checking organisation ${configFile.targetOrganisation}...`)
		const isMember = await isOrganisationMember(configFile.targetOrganisation, username, tokenCookie.accessToken)
		console.log("isOrganisationMember:", isMember)

		if (!isMember) {
			console.log(`User ${username} is not a member of ${configFile.targetOrganisation}`)
			return NextResponse.redirect("localhost:3000/signin?error=Not a member")
			// return NextResponse.json({ message: `This "${username}" is not a member of the organisation` }, { status: 403 })
		}

		console.log(`User ${username} is a member of ${configFile.targetOrganisation}`)
		return NextResponse.next()
	} catch (error: any) {
		console.log("Error while validating token: ", error.message)

		if (error?.status == 401) {
			// {
			//     "message": "Bad credentials",
			//     "documentation_url": "https://docs.github.com/rest"
			// }
			// {
			//     "message": "Requires authentication",
			//     "documentation_url": "https://docs.github.com/rest/reference/users#get-the-authenticated-user"
			// }
			// return NextResponse.json({ message: 'Login required' }, { status: 401 })
			return NextResponse.redirect("localhost:3000/signin?error=Login required")
		}

		return NextResponse.redirect("localhost:3000/signin?error=Unepxected error")
		// return NextResponse.json({ message: 'Unexpected error' }, { status: 500 })
	}
}


async function getUsername(authToken: string): Promise<string> {
	return await fetch(`https://api.github.com/user`, {
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `token ${authToken}`
		}
	}).then(response => {
		if (response.status == 200) {
			return response.json()
		}
		throw response.json()
	}).then((res) => res.login
	).catch(error => {
		throw new Error(error.message)
	})
}

async function isOrganisationMember(org: string, username: string, authToken: string): Promise<boolean> {
	return await fetch(`https://api.github.com/orgs/${org}/members/${username}`, {
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `token ${authToken}`
		}
	}).then(response => {
		if (response.status == 204) {
			return true
		}
		if (response.status == 304) {
			return false
		}
		throw response.json()
	})
}


// See "Matching Paths" below to learn more
export const config = {
	matcher: ['/api/loadLatest/', '/api/loadNew', '/api/forceNew']
}
