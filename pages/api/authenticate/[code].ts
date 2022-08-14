import { NextApiRequest, NextApiResponse } from "next";

type AuthResponse = {
  access_token: string;
  scope: string;
  token_type: string;
};

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/"

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
  const accessTokenRes = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`,
    requestOptions
  )
    // .then((response) => {
    //   return res.status(200).json(response);
    // })
    // .catch((error) => console.log("error", error));

    const temp = await accessTokenRes.json()
    console.log(temp)

    return res.status(200).json(temp)
}
