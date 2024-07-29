import passport from "passport";
import { Strategy } from "passport-discord";

export default passport.use(
  new Strategy(
    {
      clientID: "1267446858251243620",
      clientSecret: "b_0jNt6W2YDc0L5pIttqhMe-cdW0OmqX",
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ["identify", "guilds"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
    }
  )
);

// clientSecret : b_0jNt6W2YDc0L5pIttqhMe-cdW0OmqX
// clientID : 1267446858251243620
// redirect_url : http://localhost:3000/api/auth/discord/redirect
