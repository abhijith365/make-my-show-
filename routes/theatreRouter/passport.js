const GoogleStrategy = require('passport-google-oauth20').Strategy
const theatreOwn = require('../../models/Theatre_own');


module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: "491756316875-e6ob22ed35284up6iq5cib0f2o7cgkb1.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/theatre/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {

        try {
            let user = await theatreOwn.findOne({ googleId: profile.id })
            if (user) {
                done(null, user)
            }
            else {
                done(null, false)
            }
        } catch (err) {
            console.error(err);
        }
    }))


    passport.serializeUser((user, done) => {
        console.log(user)
        done(null, user)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}