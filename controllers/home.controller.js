const getHomePage = (req, res, next) => {
  try {
    res.render("users/Home", { title: "FindYourAi" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHomePage };
