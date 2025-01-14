const getHomePage = (req, res, next) => {
  try {
    res.render("users/Home", { title: "FindYourAi", user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHomePage };
