const dotenv = require("dotenv");
const http = require("http");
const express = require("express");
const session = require("cookie-session");
const { auth, requiresAuth } = require("express-openid-connect");
const { join } = require("path");
const morgan = require("morgan");
const request = require("request-promise");

dotenv.load();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.enable("trust proxy");

app.use(
  session({
    name: process.env.SESSION_NAME || "express-openid-connect",
    keys: [process.env.SESSION_SECRET || "Set a SESSION_SECRET value in env"],
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production"
  })
);

app.use(
  auth({
    required: false,
    auth0Logout: true,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
      response_type: "code",
      response_mode: "form_post",
      audience: process.env.API_AUDIENCE,
      scope: "openid profile offline_access"
    }
  })
);

// Middleware to make the `user` object available for all views
app.use(function(req, res, next) {
  res.locals.user = req.openid.user;
  next();
});

app.get("/session", function(req, res, next) {
  if (req.isAuthenticated()) res.json({ session: true });
  else res.json({ session: false });
});

app.get("/userinfo", requiresAuth(), function(req, res, next) {
  res.json(req.openid.user);
});

// Front-end calls RWA server like here.
// RWA server proxies the request to the API server.
app.get("/external", requiresAuth(), async function(req, res, next) {
  let apiData = {};
  let tokenSet = req.openid.tokens;

  if (tokenSet.expired() && tokenSet.refresh_token) {
    try {
      tokenSet = await req.openid.client.refresh(tokenSet);
    } catch (err) {
      next(err);
    }

    tokenSet.refresh_token = req.openid.tokens.refresh_token;
    req.openid.tokens = tokenSet;
  }

  try {
    apiData = await request(`${process.env.API_URL}/api/external`, {
      headers: { authorization: `Bearer ${tokenSet.access_token}` },
      json: true
    });
  } catch (err) {
    next(err);
  }

  res.json(apiData);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "build")));
  app.use((_, res) => {
    res.sendFile(join(__dirname, "build", "index.html"));
  });
}

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV !== "production" ? err : {}
  });
});

const port = process.env.PORT || 3001;

http.createServer(app).listen(port, () => {
  console.log(`RWA backend listening on http://localhost:${port}`);
});
