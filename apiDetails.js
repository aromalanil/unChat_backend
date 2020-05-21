//An Object containing details about routes available in this API

const apiDetails = {
    message: "unChat REST API",
    endpoints: [
        {
            url: '/user/login',
            params: ['username', 'password'],
            description: 'Allow the user to login by generating a jwt'
        },
        {
            url: '/user/logout',
            params: [],
            description: 'Allow the user to logout from the device'
        },
        {
            url: '/user/register',
            params: ['name', 'username', 'password'],
            description: 'Allow new user to register for the service'
        },
        {
            url: '/user/dashboard',
            params: [],
            description: 'Returns Username,Name and Messages of Logged In User (User should be logged in to have access)'
        },
        {
            url: '/user/password',
            params: ['username', 'password','newPassword'],
            description: 'Change password of existing user'
        },
        {
            url: '/user/:username',
            params:[],
            description: 'Get details of the specific user'
        },
        {
            url: '/message/:username',
            params: ['message'],
            description: 'Sends message to the corresponding username'
        }
    ]
}

module.exports = apiDetails;