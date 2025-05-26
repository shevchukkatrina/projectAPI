const { usersService } = require('../../service');

const getAllUsers = async (req, res) => {
    const users = await usersService.getAllUsers();

    res.json({ users });
};

module.exports = getAllUsers;
