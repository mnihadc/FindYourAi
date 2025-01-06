const getHomePage = (req, res, next) => {
  try {
    res.render("Home", { title: "Home Page" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHomePage };
