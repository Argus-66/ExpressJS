import passport from 'passport';
import { Strategy } from 'passport-local';
import { mockUsers } from "../utils/constants.mjs";
import { User } from '../mongoose/schemas/user.mjs';
import { comparePassword } from '../utils/helpers.mjs';

passport.serializeUser((user, done) => {
    console.log(`Inside Serializing User`);
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log(`Inside Deserializing`);
    console.log(`Inside Deserializing User: ${id}`);
    try{
        const findUser = await User.findById(id);
        if(!findUser) throw new Error('User not found');
        done(null, findUser);
    } catch(err){
        done(err, null);
    }
});

export default passport.use(
    new Strategy(async (username, password, done) => {
        try{
            const findUser = await User.findOne({ username });
            if(!findUser) throw new Error('User not found');
            if(!comparePassword(password, findUser.password)) throw new Error('Invalid password');
            done(null, findUser);
        } catch(err){
            done(err, null);
        }
        })
);

