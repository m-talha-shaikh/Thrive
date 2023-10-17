
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const executeQuery = require('../utils/executeQuery');
const argon2 = require('argon2');
const { error } = require('console');


const signToken = (user_id) => {
  return jwt.sign({ user_id }, "my-ultra-secret", {
    expiresIn: 90*24*60*60,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.user_id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  const { username, email, account_type, password, ProfilePic, CoverPic, city, state, country, ...categoryData } = req.body;
  const check_query = "SELECT * FROM user WHERE username = ?";
  const check_location = "SELECT location_id FROM location WHERE city = ? AND state = ? AND country = ?";
  

  try {
    // Check if the username already exists
    const checkqueryresult = await executeQuery(req.db, check_query, [username]);

    if (checkqueryresult.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

let location = await executeQuery(req.db, check_location, [city, state, country]);
let location_id;

if (location.length === 0) {
  const locationResult = await executeQuery(req.db, `INSERT INTO location (city, state, country) VALUES (?, ?, ?);`, [city, state, country]);
  location_id = locationResult.insertId;
} else {
  location_id = location[0].location_id;
}



    const hashedPassword = await argon2.hash(password);

    const createUserQuery = `
      INSERT INTO user (username, email, account_type, password, ProfilePic, CoverPic)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const userQueryValues = [username, email, account_type, hashedPassword, ProfilePic, CoverPic];
    const userQueryResult = await executeQuery(req.db, createUserQuery, userQueryValues);

    const user_id = userQueryResult.insertId;


    let categoryQuery;
    let categoryQueryValues;
    let categoryTableName;

    if (account_type === 'person') {
      categoryTableName = 'person';
      categoryQuery = `
        INSERT INTO person (user_id, first_name, last_name, date_of_birth, gender, location_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      categoryQueryValues = [
        user_id,
        categoryData.first_name,
        categoryData.last_name,
        categoryData.date_of_birth,
        categoryData.gender,
        location_id
      ];

    } else if (account_type === 'institute') {
      categoryTableName = 'institute';
      categoryQuery = `
        INSERT INTO institute (user_id, name, institute_type, location_id, description, website_url, contact)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      categoryQueryValues = [
        user_id,
        categoryData.name,
        categoryData.institute_type,
        location_id,
        categoryData.description,
        categoryData.website_url,
        categoryData.contact,
      ];
    } else if (account_type === 'organization') {
      categoryTableName = 'organization';
      categoryQuery = `
        INSERT INTO organization (user_id, name, industry, location_id, description, website_url, contact)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      categoryQueryValues = [
        user_id,
        categoryData.name,
        categoryData.industry,
        location_id,
        categoryData.description,
        categoryData.website_url,
        categoryData.contact,
      ];
    } else {
      console.log("Oh no");
      return res.status(400).json({ message: 'Invalid account_type' });
    }

    await executeQuery(req.db, categoryQuery, categoryQueryValues);

    const fetchCategoryQuery = `
      SELECT * FROM ${categoryTableName} WHERE user_id = ?
    `;

    const categoryDataResult = await executeQuery(req.db, fetchCategoryQuery, [user_id]);

    const user = {
      user_id: user_id,
      account_type: account_type,
      category_data: categoryDataResult[0],
    };

    createSendToken(user, 201, res);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const users = await executeQuery(req.db, 'SELECT * FROM user WHERE email = ?', [email]);
      if (users.length > 0) {
        const user = users[0];

        const match = await argon2.verify(user.password, password);

        if (match) {
          createSendToken(user, 200, res);

        } else {
          res.status(401).json({ error: 'Incorrect Email or password' });
        }
      } else {
        res.status(401).json({ error: 'Incorrect Email or password' });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json({ error: 'Missing email or password' });
  }
};


exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'You are not logged in' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, "my-ultra-secret");

    const protectQuery = `SELECT * FROM user WHERE user_id = ?`;
    const protectQueryValues = [decoded.user_id];
    const user = await executeQuery(req.db, protectQuery, protectQueryValues);

    if (!user.length) {
      return res.status(401).json({ error: 'The user no longer exists' });
    }

    req.user = user[0];
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.restrictTo = (...allowedUserTypes) => {
  return (req, res, next) => {
    if (!allowedUserTypes.includes(req.user.account_type)) {
      return res.status(403).json({ error: 'Your account type does not support this functionality' });
    }
    next();
  };
};

exports.authorize = () => {
  return (req, res, next) => {
    if(req.user.user_id === req.params.user_id){
      next();
  }
    else {
      res.status(403).json({ error: 'You are not authorized' });
    }
  };
};
exports.logout = (req, res) => {
  // Clear the JWT token from the client's cookies
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
};
