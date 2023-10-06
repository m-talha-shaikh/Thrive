const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const executeQuery = require('../utils/executeQuery');
const argon2 = require('argon2');
const { error, log } = require('console');


const signToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.user_id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
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
  const { user_id,account_type, username, email, password,ProfilePic,CoverPic ,...categoryData } = req.body;  
  console.log("jhchwehfuw ami");
  try {
    const userNameExists = await executeQuery(req.db, `SELECT * FROM users WHERE username = ?`, [username])
   console.log("jefej");
    if (userNameExists.length > 0) {
      return res.status(400).json({ error: 'Username already exists'})
    }
console.log("jefej");
    const hashedPassword = await argon2.hash(password);

    console.log("paas wordk hass");
    const createUserQuery = `
      INSERT INTO users (user_id,account_type, username, email, password,ProfilePic,CoverPic)
      VALUES (?, ?, ?, ?,?,?)
    `;

    const userQueryValues = [account_type, username, email, hashedPassword,ProfilePic,CoverPic];
    const userQueryResult = await executeQuery(req.db, createUserQuery, userQueryValues).then(console.log("uploaded succesfully"));

    // const user_id = userQueryResult.insertId;

    // let categoryQuery;
    // let categoryQueryValues;
    // let categoryTableName;

    // if (account_type === 'person') {
    //   categoryTableName = 'person';
    //   categoryQuery = `
    //     INSERT INTO person (user_id, first_name, last_name, date_of_birth, gender, location_id)
    //     VALUES (?, ?, ?, ?, ?, ?)
    //   `;

    //   categoryQueryValues = [
    //     user_id,
    //     categoryData.first_name,
    //     categoryData.last_name,
    //     categoryData.date_of_birth,
    //     categoryData.gender,
    //     categoryData.location_id,
    //   ];
    // } else if (account_type === 'institute') {
    //   categoryTableName = 'institute';
    //   categoryQuery = `
    //     INSERT INTO institute (user_id, name, institute_type, location_id, description, website_url, contact)
    //     VALUES (?, ?, ?, ?, ?, ?, ?)
    //   `;

    //   categoryQueryValues = [
    //     user_id,
    //     categoryData.name,
    //     categoryData.institute_type,
    //     categoryData.location_id,
    //     categoryData.description,
    //     categoryData.website_url,
    //     categoryData.contact,
    //   ];
    // } else if (account_type === 'organization') {
    //   categoryTableName = 'organization';
    //   categoryQuery = `
    //     INSERT INTO organization (user_id, name, industry, location_id, description, website_url, contact)
    //     VALUES (?, ?, ?, ?, ?, ?, ?)
    //   `;

    //   categoryQueryValues = [
    //     user_id,
    //     categoryData.name,
    //     categoryData.industry,
    //     categoryData.location_id,
    //     categoryData.description,
    //     categoryData.website_url,
    //     categoryData.contact,
    //   ];
    // } else {
    //   return res.status(400).json({ message: 'Invalid account_type' });
    // }

    // await executeQuery(req.db, categoryQuery, categoryQueryValues);

    // const fetchCategoryQuery = `
    //   SELECT * FROM ${categoryTableName} WHERE user_id = ?
    // `;

    // const categoryDataResult = await executeQuery(req.db, fetchCategoryQuery, [user_id]);

    // const user = {
    //   user_id: user_id,
    //   account_type: account_type,
    //   category_data: categoryDataResult[0],
    // };

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
      const user = await executeQuery(req.db, 'SELECT * FROM users WHERE email = ?', [email]);
      if (user.length > 0) {
        const match = await argon2.verify(user[0].password , password);

        if (match) {
          createSendToken(user[0], 200, res);
        } else {
          res.status(401).json({ error: 'Incorrect Email or password' });
        }
      } else {
        res.status(401).json({ error: 'Incorrect Email or password' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
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
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const protectQuery = `SELECT * FROM users WHERE user_id = ?`;
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