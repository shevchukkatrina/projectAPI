const { usersService } = require("../../service");

const createUser = async (req, res) => {
  const userData = req.body;

  const { email, password, firstName, lastName, phoneNumber } = userData;

  if (
    [email, password, firstName, lastName, phoneNumber].some(
      (value) => value === undefined
    )
  ) {
    throw new Error("Some required field is missing");
  }

  const result = await usersService.createUser(userData);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
};

module.exports = createUser;
