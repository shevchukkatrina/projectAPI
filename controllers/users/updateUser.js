const { usersService } = require('../../service');

const updateUser = async (req, res) => {
    const { id } = req.params;

    const keys = Object.keys(req.body);

    const validKeys = ['email', 'password', 'firstName', 'lastName', 'phoneNumber'];

    const keysValid = keys.every(item => validKeys.includes(item));

    if (!keysValid) {
        return res.status(400).json({
            success: false,
            message: 'Some key name is wrong',
        });
    }

    const result = await usersService.updateUser(id, req.body);
    res.json({ user: result });
};

module.exports = updateUser;
