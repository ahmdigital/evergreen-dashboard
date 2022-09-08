import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from 'cookie';
import { encodeTokenCookie, TokenCookie } from "../../../src/authenticationMiddleware";

type AuthResponse = {
	access_token: string;
	scope: string;
	token_type: string;
};

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URL || `http://localhost:${process.env.PORT || 3000}/signin/`

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const code = req.query.code;
	console.log(code);

	let myHeaders = new Headers();
	myHeaders.append("Accept", "application/json");

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
	};

	try {

		const tokenObj = await fetch(
			`https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`,
			requestOptions
		).then(r => r.json())

		const accessToken = tokenObj.access_token
		console.log("accessToken:", accessToken)

		const tokenCookie:TokenCookie = { accessToken }
		console.log("Token cookie:", tokenCookie)
		const tokenCookieString = encodeTokenCookie(tokenCookie)
		console.log("Encoded token cookie:", tokenCookieString)

		res.setHeader('Set-Cookie', serialize('token', tokenCookieString,  {
				httpOnly: true,
				maxAge: 3600 * 24 * 365,
				sameSite: 'strict',
				secure: true,
				path: '/'
			}))

		return res.status(200).end()
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'Unexpected error' })
	}
}
