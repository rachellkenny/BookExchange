//This controller handles book search, add function, inventory data

exports.mybooks = function(req, res) {
  if (req.session.user) {
    res.render("mybooks", {
      email: req.session.user.email,
      fname: req.session.user.fname
    });
  } else {
    res.render("landing");
  }
};
exports.add = function(req, res) {
  if (req.session.user) {
    res.render("add", {
      email: req.session.user.email,
      fname: req.session.user.fname
    });
  } else {
    res.render("landing");
  }
};
exports.search = function(req, res) {
  if (req.session.user) {
    res.render("search", {
      email: req.session.user.email,
      fname: req.session.user.fname
    });
  } else {
    res.render("landing");
  }
};
