const apiDetails = {
    message: "Anonymous Messaging API",
    endpoints: [
        {
            url: '/user/login',
            params: ['username', 'password'],
            description: 'Allow the user to login by generating a jwt'
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
            url: '/message/:username',
            params: ['message'],
            description: 'Sends message to the corresponding username'
        }
    ]
}

module.exports = apiDetails;