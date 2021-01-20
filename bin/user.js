const auth = require("../middleware/auth");
const User = require("../models/User");

const postUsers = async (body) => {
  try {
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

const login = async (body) => {
  try {
    const { email, password } = body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

const logout = async (user) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const logoutall = async (user) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    return { status: true };
  } catch (error) {
    {
      status: false, error;
    }
  }
};

const updateUser = () => {};

const deleteUser = () => {};

module.exports = {
  postUsers,
  login,
  logoutall,
  updateUser,
  deleteUser,
};
