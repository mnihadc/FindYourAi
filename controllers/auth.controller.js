const getLoginPage = (req, res, next) => {
  try {
    res.render("users/Login", { title: "Login", getLoginpage: true });
  } catch (error) {
    next(error);
  }
};
module.exports = { getLoginPage };
