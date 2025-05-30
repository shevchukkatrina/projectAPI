/* eslint-disable no-unused-vars */
const { usersService } = require('../../service');

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const result = await usersService.deleteUser(id);
    return res.status(204).send();
};

module.exports = deleteUser;
