import bcrypt from 'bcrypt'; // npm i bcrypt

const saltRounds = 10; // higher the rounds, more secure

// Generate a hashed password
export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    return bcrypt.hashSync(password, salt)
};