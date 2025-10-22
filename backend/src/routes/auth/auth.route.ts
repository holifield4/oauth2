import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import config from "../../config/config";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../../types/auth.types";

const router = Router();

router.post("/auth/authorize", async (req: Request, res: Response) => {
  const redirectUrl = "http://localhost:3000/api/v1/oauth";

  const oAuth2Client = new OAuth2Client(
    config.clientId,
    config.clientSecret,
    redirectUrl,
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline", //force create refresh token
    scope: "https://www.googleapis.com/auth/userinfo.profile openid", //enabled scope from developer console
    prompt: "consent", //consent screen
  });

  res.json({ url: authorizeUrl });
});

const getUserData = async (access_token: string) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
  );

  const data = await response.json();

  return data;
};

router.get(
  "/oauth",
  async (req: Request, res: Response, next: NextFunction) => {
    const code = req.query.code;

    if (typeof code !== "string") {
      return res
        .status(400)
        .json({ error: "Authorization code is missing or invalid" });
    }

    try {
      const redirectUrl = "http://localhost:3000/api/v1/oauth";

      const oAuth2Client = new OAuth2Client(
        config.clientId,
        config.clientSecret,
        redirectUrl,
      );

      const response = await oAuth2Client.getToken(code);
      await oAuth2Client.setCredentials(response.tokens);

      const user = oAuth2Client.credentials;

      // await getUserData(user.access_token); //fetch user data from google api @ for reference

      if (!user.id_token) {
        return res.status(400).json({ error: "ID token is missing" });
      }

      const ticket = await oAuth2Client.verifyIdToken({
        idToken: user.id_token,
        audience: config.clientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        return res
          .status(400)
          .json({ error: "Failed to acquired ticket payload" });
      }

      const userId = payload["sub"];
      const name = payload["name"];
      const email = payload["email"];
      const picture = payload["picture"];

      const appUser: AuthUser = {
        userId,
        name,
        email,
        picture,
      };

      //save appuser to db

      //create jwt token
      const token = jwt.sign(appUser, config.jwtKey, {
        expiresIn: "24h",
      });

      //set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.redirect(302, "http://localhost:5173/");
    } catch (error) {
      console.log("Error occurred when signing with google");
      next(error);
    }
  },
);

export default router;
