const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/UserSchema");
require("dotenv").config(); // Load env variables before accessing them

// Google OAuth Strategy
// Handles: new signups, linking existing accounts, returning users

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/api/auth/google/callback",
                scope: ["profile", "email"],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;
                    const googleId = profile.id;
                    const name = profile.displayName;

                    // Existing user with Google ID
                    let user = await User.findOne({ googleId });
                    if (user) {
                        return done(null, user);
                    }

                    // Existing user with same email - link accounts
                    user = await User.findOne({ email });
                    if (user) {
                        user.googleId = googleId;
                        user.isVerified = true;
                        await user.save();
                        return done(null, user);
                    }

                    // New user - create account
                    user = new User({
                        name,
                        email,
                        googleId,
                        isVerified: true,
                    });
                    await user.save();
                    return done(null, user);

                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
    console.log("✅ Google OAuth configured");
} else {
    console.log("⚠️  Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
}

// Serialize user ID into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;

