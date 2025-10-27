import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Email not found"));

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            username: profile.displayName.toLowerCase().replace(/\s/g, ""),
            email,
            profilePicture: profile.photos?.[0]?.value || null,
            password: "GOOGLE_OAUTH_TEMP_PASSWORD", // temp password
          });
          await user.save();
        }

        done(null, user); // must be a Mongoose document
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
