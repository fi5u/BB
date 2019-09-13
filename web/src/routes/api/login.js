const fetch = require('node-fetch')

async function login(email, password) {
  return Promise.resolve({
    status: 201
  })

  // const { AUTH_SERVICE } = process.env;
  // // Calls the external refresh token create endpoint
  // const response = await fetch(AUTH_SERVICE + '/api/refresh_tokens',
  //     {
  //         method: 'POST',
  //         headers: {
  //             'Accept': 'application/ld+json',
  //             'Content-Type': 'application/ld+json'
  //         },
  //         body: JSON.stringify({email: email, password: password})
  //     });

  // return await response;
}

export async function post(req, res, next) {
  // Call an authenication microservice to handle the authentication.
  // const { AUTH_SERVICE } = process.env;
  if (true /* AUTH_SERVICE */) {
    const response = await login(req.body.email, req.body.password)
    res.status(await response.status);

    if (response.status === 201) {
      // const data = await response.json();
      req.session.user = true;
      // req.session.refresh_token = data.token;
      // req.session.rt_id = data["@id"];
      res.end();
    }
  }
}