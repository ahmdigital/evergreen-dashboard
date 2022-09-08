import configFile from "../config.json";
import fetch from 'node-fetch';
import { NextApiRequest, NextApiResponse } from 'next';

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

async function getUsername(authToken: string): Promise<string> {
	return await fetch(`https://api.github.com/user`, {
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `Bearer ${authToken}`
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

// If user token is used, it must have a scope of "repo" for non admin users
async function isOrganisationMember(org: string, username: string, authToken: string): Promise<boolean> {
	return await fetch(`https://api.github.com/orgs/${org}/members/${username}`, {
		headers: {
			"Accept": "application/vnd.github+json",
			"Authorization": `Bearer ${authToken}`
		}
	}).then(response => {
		if (response.status == 204) {
			return true
		}
		else if (response.status == 302) {
			return false
		}
		else if (response.status == 404){
			return false
		}
		throw response.json()
	})
}


export async function checkAuthorisation(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
	console.log("Middleware called for: " + req.url)
	if (configFile.requireAuthentication == false) {
		console.log("Granting access to user")
		return true
	}
	console.log(req.cookies)
	const tokenString = (req as any).cookies.token


	if (tokenString == null) {
		console.log("Token not present")
		res.status(401).json({ message: 'Login required' })
		return false
	}
	try {

		const tokenCookie = decodeTokenCookie(tokenString)

		const username = await getUsername(tokenCookie.accessToken)
		const isMember = await isOrganisationMember(configFile.targetOrganisation, username, tokenCookie.accessToken)

		if (!isMember) {
			console.log(`User ${username} is not a member of ${configFile.targetOrganisation}`)
			//return NextResponse.redirect("localhost:3000/signin?error=Not a member")
			res.status(403).json({ message: `"${username}" is not a member of the organisation` })
			return false
		}

		console.log(`User ${username} is a member of ${configFile.targetOrganisation}`)
		return true
	} catch (error: any) {
		if (error?.status == 401) {
			res.status(401).json({ message: 'Login required' })
			return false
		}
		console.log("Error while checking authorisation: ", error.message)

		res.status(500).json({ message: 'Unexpected error' })
		return false
	}
}
