import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import {
	encodeTokenCookie,
	TokenCookie,
} from "../../../src/authenticationMiddleware";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const code = req.query.code;

	let myHeaders = new Headers();
	myHeaders.append("Accept", "application/json");

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
	};

	try {
		const tokenObj = await fetch(
			`https://github.com/login/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`,
			requestOptions,
		).then((r) => r.json());

		const accessToken = tokenObj.access_token;
		const tokenCookie: TokenCookie = { accessToken };
		const tokenCookieString = encodeTokenCookie(tokenCookie);
		console.log("Encoded token cookie");

		res.setHeader(
			"Set-Cookie",
			serialize("token", tokenCookieString, {
				httpOnly: true,
				maxAge: 3600 * 24 * 365,
				sameSite: "strict",
				secure: true,
				path: "/",
			}),
		);

		return res.status(200).end();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Unexpected server error" });
	}
}
