import passport from 'passport';
import { Strategy } from 'passport-local';
import { mockUsers } from "../utils/constants.mjs";

passport.use(
    new Strategy((username, password, done) => {
        try{
            const findUser = mockUsers.find(user => user.username === username);
            if(!findUser) throw new Error('User not found');
            if (findUser.password!== password) throw new Error('Invalid credentials');
            done(null, findUser);
        } catch(err){
            done(err, null);
        }
        }),
)