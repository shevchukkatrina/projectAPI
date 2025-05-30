const { usersService } = require('../../service');

const createUser = async (req, res) => {
    const userData = req.body;

    const { email, password, firstName, lastName, phoneNumber } = userData;

    if ([email, password, firstName, lastName, phoneNumber].some(value => value === undefined)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    const result = await usersService.createUser({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
    });

    return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
    });
};

module.exports = createUser;
