import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import styles from "../styles/signin.module.css";
import { GitHubIcon } from "../components/GitHubIcon";
import * as React from "react";
import TrafficIcon from "@mui/icons-material/Traffic";
import Image from "next/image";
import ForestIcon from "@mui/icons-material/Forest";
import GreenSuccessIcon from "../components/images/greenLight.svg";
import RedFailIcon from "../components/images/redLight.svg";

const SCOPE = "repo";

// Sign In with GitHub button
const signInButtonStyling = {
  backgroundColor: "black",
  width: "100%",
  "&:hover": {
    backgroundColor: "#2e2e2e",
  },
};

// Sign in box styling
const signInContainer = {
  width: "100%",
  maxWidth: "400px",
  minHeight: "200px",
  padding: "1.5rem",
  backgroundColor: "var(--colour-white)",
  boxShadow: "var(--main-section-boxshadow)",
  borderRadius: "var(--main-section-border-radius)",
  fontFamily: "var(--primary-font-family)",
  boxSizing: "content-box",
  justifyContent: "center",
};

// Continue to dashboard button
const continueToButton = {
  backgroundColor: "var(--colour-green)",
  width: "100%",
  "&:hover": {
    backgroundColor: "rgb(45, 210, 36);",
  },
};

export async function getServerSideProps() {
  return {
    props: {
      clientID: process.env.NEXT_PUBLIC_CLIENT_ID,
      redirectURI: process.env.NEXT_PUBLIC_REDIRECT_URI,
    }, // will be passed to the page component as props
  };
}

// get code
function redirect(clientID: string, redirectURI: string) {
  const uuid = self.crypto.randomUUID();
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${SCOPE}&state=${uuid}`;
}

type SignInStatus =
  | "calculating"
  | "not-signed-in"
  | "exchanging-code-for-token"
  | "signed-in"
  | "error-while-signing-in";

export default function SignIn(props: {
  clientID: string;
  redirectURI: string;
}) {
  const router = useRouter();

  const [token, setToken] = useState<string>("");

  const [signInStatus, setSignInStatus] = useState<SignInStatus>("calculating");

  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    setErrorMessage(undefined as any);

    if (router == null) {
      return;
    }
    const code = router.query.code?.toString();
    const error = router.query.error?.toString();

    if (error != null) {
      setSignInStatus("error-while-signing-in");
      error === "access_denied" &&
        setErrorMessage(
          "You have denied access to your GitHub account. Please try again."
        );
      error === "not_a_member" &&
        setErrorMessage(
          "You are not a member of the organisation. Please sign in with a different account."
        );
    } else if (code != null) {
      setSignInStatus("exchanging-code-for-token");
      console.log(`code ${code}`);

      //This immediately called function must be defined because useEffect handlers cannot be async
      const isSignedIn = async () => {
        const response = await fetch(
          `/api/authenticate/${encodeURIComponent(code.toString())}/`
        );
        if (response.status == 200) {
          return true;
        }

        throw await response.json();
      };
      isSignedIn()
        .then(async () => {
          setSignInStatus("signed-in");
        })
        .catch((error) => {
          console.log("error while exchanging token", error);
          setSignInStatus("error-while-signing-in");
          error?.message && setErrorMessage(error.message);
        });
    } else {
      setSignInStatus("not-signed-in");
    }
  }, [router]);

  /**
   * Called when the user clicks the Try Again button after an error occurred
   */
  function handleTryAgain() {
    router.push("/signin");
  }

  return (
    <>
      <Grid
        container
        alignItems="stretch"
        sx={{
          height: "100vh",
        }}
      >
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            backgroundImage:
              "linear-gradient(115deg, #CFF4D2, #7BE495, #56C596, #329D9C, #205072)",
            backgroundSize: "cover",
            backgroundPositionX: "80%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ padding: 4 }}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4">
              Evergreen <ForestIcon />{" "}
            </Typography>
            <Typography
              sx={{
                fontSize: "var(--font-size-large)",
                fontWeight: "var(--font-weight-normal)",
              }}
              variant="body1"
            >
              Evergreen lets you track all your dependencies in one simple
              dashboard.
            </Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              left: "75px",
              width: "120%",
              display: {
                xs: "none",
                md: "initial",
              },
            }}
          >
            <Image
              src="/dashboardSS.png"
              alt="Screenshot of the Evergreen Dashboard"
              width={2692}
              height={2048}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid
        sx={{
          position: "fixed",
          top: "50%",
          left: {
            xs: "50%",
            md: "70.83%", // 5/12 + (1 - 5/12) * 1/2
          },
          transform: "translate(-50%, -50%)",

          width: {
            xs: "100%",
            md: "58.33%", // 1 - 5/12
          },
          padding: 4,
        }}
        container
        className={styles.signinPage}
        justifyContent="center"
        alignContent="center"
      >
        <Paper sx={signInContainer}>
          <Typography
            variant="h4"
            sx={{ marginBottom: "1.5rem", marginLeft: "1rem" }}
            component="h1"
          >
            <span className={styles.everGreen}>Evergreen Dashboard</span>{" "}
          </Typography>

          {signInStatus === "calculating" && (
            <>
              <Grid container direction="column" alignItems="center">
                <CircularProgress />
              </Grid>
            </>
          )}
          {signInStatus === "not-signed-in" && (
            <>
              <Box
                sx={{
                  paddingBottom: 3,
                  paddingTop: 5,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={signInButtonStyling}
                  onClick={() => redirect(props.clientID, props.redirectURI)}
                  startIcon={<GitHubIcon />}
                >
                  Sign In With GitHub
                </Button>
              </Box>
            </>
          )}
          {signInStatus === "exchanging-code-for-token" && (
            <>
              <Grid container direction="column" alignItems="center">
                <CircularProgress />
              </Grid>
            </>
          )}
          {signInStatus === "error-while-signing-in" && (
            <>
              <Grid container direction="column" alignItems="center">
                <Typography
                  align="center"
                  variant="h5"
                  sx={{
                    marginBottom: "1.5rem",
                    fontWeight: "bold",
                    color: "var(--colour-red)",
                  }}
                >
                  Error!
                </Typography>

                <RedFailIcon
                  layout="fixed"
                  alt={"Login Failed"}
                  width="40px"
                  height={"40px"}
                  fill={"var(--login-failed)"}
                />

                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--colour--black)",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  {errorMessage
                    ? errorMessage
                    : "Whoops! There was an error while trying to sign you in."}
                </Typography>
                <Button
                  onClick={handleTryAgain}
                  variant="contained"
                  color="error"
                >
                  Try Again
                </Button>
              </Grid>
            </>
          )}
          {signInStatus === "signed-in" && (
            <>
              <Grid container direction="column" alignItems="center">
                <Typography
                  align="center"
                  variant="h5"
                  sx={{
                    marginBottom: "1.5rem",
                    fontWeight: "bold",
                    color: "var(--colour-green)",
                  }}
                >
                  Success!
                </Typography>

                <GreenSuccessIcon
                  layout="fixed"
                  alt={"Login Sucessfull"}
                  width="40px"
                  height={"40px"}
                  fill={"var(--login-success)"}
                />

                <Typography
                  align="center"
                  variant="body1"
                  sx={{
                    color: "var(--colour--black)",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  Your login was successful
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  endIcon={<TrafficIcon />}
                  sx={continueToButton}
                  href="/"
                >
                  Continue to Dashboard
                </Button>
              </Grid>
            </>
          )}
        </Paper>
      </Grid>
    </>
  );
}
