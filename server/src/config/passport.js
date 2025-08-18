import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';

// Configure the Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    return done(null, user);
                }
                user = await User.findOne({ email: profile.emails[0].value });
                if (user) {
                    user.googleId = profile.id;
                    user.provider = 'google';
                    await user.save();
                    return done(null, user);
                }

                const newUser = await User.create({
                    googleId: profile.id,
                    provider: 'google',
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    isEmailVerified: true,
                    accountStatus: 'active',
                });
                return done(null, newUser);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// Export the configured Passport instance
export default passport;