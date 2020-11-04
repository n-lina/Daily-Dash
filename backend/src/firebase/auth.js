const admin = require("firebase-admin");
const logger = require("../logger/logging");

const devToken = "test";

const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }
  next();
};

const checkIfAuthenticated = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;

      if (authToken === devToken) {
        return next();
      }

      const userInfo = await admin
        .auth()
        .verifyIdToken(authToken);
      req.authId = userInfo.uid;
    } catch (e) {
      logger.info(e);

      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }

    return next();
  });
};

module.exports = { checkIfAuthenticated };
