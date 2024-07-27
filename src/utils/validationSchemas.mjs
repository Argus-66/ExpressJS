export const createUserValidationSchema = {
    username: {
        isLength:{
            options:{
                min:4,
                max:32,
            },
            errorMessage: 'Username should be between 4 and 32 characters',
        },
        notEmpty:{
            errorMessage: 'Username is required',
        },
        isString:{
            errorMessage: 'Username should be a string',
        },
    },
    displayName:{
        notEmpty:true,
    },
}