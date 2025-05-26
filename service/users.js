const bcrypt = require('bcryptjs');
const { User } = require('../models');

const getAllUsers = async () => {
    const users = await User.find().select('-password -_id -createdAt -updatedAt -__v');
    return users;
};

const getUser = async id => {
    const user = await User.findById(id);
    return user;
};

const createUser = async data => {
    const { email, password, firstName, lastName, phoneNumber, role = 'user' } = data;
    // Перевірка чи користувач вже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення користувача
    const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role,
    });

    await user.save();

    // Генерація JWT токена
    const token = generateToken(user._id, user.role);

    return {
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            role: user.role,
        },
        token,
    };
};

const updateUser = async (userId, data) => {
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, data, {
        new: true,
    });
    return updatedUser;
};

const deleteUser = async userId => {
    const user = await User.findOneAndDelete({
        _id: userId,
    });
};

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
