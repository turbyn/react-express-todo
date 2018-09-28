const authenticator = (req, res, next) => {
  if(req.user.googleId){
    next();
  }else{
    res.status(403).end();
  }
}

module.exports = {
  authenticator
}
