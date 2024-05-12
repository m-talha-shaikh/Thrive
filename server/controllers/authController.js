const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const executeQuery = require('../utils/executeQuery');
const argon2 = require('argon2');
const { error } = require('console');
const nodemailer = require('nodemailer')

const signToken = (user_id) => {
  return jwt.sign({ user_id }, 'my-ultra-secret', {
    expiresIn: 90 * 24 * 60 * 60,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.user_id);
  console.log(token)
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  cookieOptions.secure = false;
  cookieOptions.sameSite = 'Lax';


  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.generateOTP = async (req, res) => {
  console.log("Meow")
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const updateQuery = `
        UPDATE user 
        SET otp = '${otp}', otp_time = NOW()
        WHERE email = '${email}';`;

    try {
        const result = await executeQuery(req.db, updateQuery);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Email not found in the database' });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: 'thrivecorp.pk@gmail.com',
                pass: 'reollmjpgkxsztrm'
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Your OTP',
            text: `Hi Dear Valued Thrive User \n You requested a password change \n
            Here is your OTP ${otp} \n The OTP will expire in 10 minutes \n`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ message: 'Error sending OTP', error: error.message });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: 'OTP sent successfully' });
            }
        });
    } catch (error) {
        console.error('Error inserting OTP into the database:', error);
        return res.status(500).json({ message: 'Error generating OTP', error: error.message });
    }
};


// exports.generateOTP = async (req, res) => {
//     const { email } = req.body;
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
//     const updateQuery = `
//     UPDATE user 
//     SET otp = '${otp}', otp_time = NOW()
//     WHERE email = '${email}';
// `;


//     try {
//         await executeQuery(req.db, updateQuery);
//     } catch (error) {
//         console.error('Error inserting OTP into the database:', error);
//         return res.status(500).json({ message: 'Error generating OTP', error: error.message });
//     }

//     const transporter = nodemailer.createTransport({
//     service: "gmail",
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'thrivecorp.pk@gmail.com',
//         pass: 'reollmjpgkxsztrm'
//     }
// });


// const mailOptions = {
//     from: {
//         name: 'Thrive Corporation',
//         address: 'thrivecorp.pk@gmail.com'
//     },
//     to: email,
//     subject: 'Your OTP for verification',
//     text: `Welcome to the Thrive App. Your OTP (One-Time Password) is: ${otp}`
// };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent with OTP');
//         return res.status(200).json({ message: 'OTP sent successfully' });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         return res.status(500).json({ message: 'Error sending OTP email', error: error.message });
//     }
// };


exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    console.log("E" + email)
    console.log("O" + otp)
    const checkQuery = `
        SELECT user_id
        FROM user 
        WHERE email = '${email}' 
        AND otp = '${otp}' 
        AND otp_time >= NOW() - INTERVAL 10 MINUTE`;

    try {
        const result = await executeQuery(req.db, checkQuery);
        if (result.length === 0) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }

        const userId = result[0].user_id;

        const updateQuery = `UPDATE user SET verified_user = true WHERE user_id = ${userId}`;
        await executeQuery(req.db, updateQuery);

        return res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.error('Error verifying user:', error);
        return res.status(500).json({ message: 'Error verifying user', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const hashedPassword = await argon2.hash(newPassword);

    
    const updatePasswordQuery = `
        UPDATE user 
        SET password = '${hashedPassword}' 
        WHERE email = '${email}'`;

    try {
        
        const result = await executeQuery(req.db, updatePasswordQuery);

        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Successfully updated password
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Error updating password', error: error.message });
    }
};





exports.signup = async (req, res, next) => {
  const {
    username,
    email,
    account_type,
    password,
    city,
    state,
    country,
    ...categoryData
  } = req.body;

  console.log(req.body)

  ProfilePic = "Thrive/d9nhe5yo56qxoejxyunl"
  CoverPic = "Thrive/hvvpprm0lwgzdtvlgsjc"

  const check_query = 'SELECT * FROM user WHERE username = ?';
  const check_location =
    'SELECT location_id FROM location WHERE city = ? AND state = ? AND country = ?';

  // Start a transaction
  const transaction = await executeQuery(req.db, 'START TRANSACTION');

  try {
    const checkqueryresult = await executeQuery(req.db, check_query, [
      username,
    ]);

    if (checkqueryresult.length > 0 || password == '' || !email.includes('@')) {
      // Rollback the transaction if username already exists
      console.log("Username Already Exist Rollback");
      await executeQuery(req.db, 'ROLLBACK', []);
      return res.status(400).json({ error: 'Username already exists' });
    }

    let location = await executeQuery(req.db, check_location, [
      city,
      state,
      country,
    ]);
    let location_id;

    if (location.length === 0) {
      const locationResult = await executeQuery(
        req.db,
        `INSERT INTO location (city, state, country) VALUES (?, ?, ?);`,
        [city, state, country]
      );
      location_id = locationResult.insertId;
    } else {
      location_id = location[0].location_id;
    }

    const hashedPassword = await argon2.hash(password);

    const createUserQuery = `
      INSERT INTO user (username, email, account_type, password, ProfilePic, CoverPic)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const userQueryValues = [
      username,
      email,
      account_type,
      hashedPassword,
      ProfilePic,
      CoverPic,
    ];
    const userQueryResult = await executeQuery(
      req.db,
      createUserQuery,
      userQueryValues
    );

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
        location_id,
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
      // Rollback the transaction for an invalid account_type
      await executeQuery(req.db, 'ROLLBACK', []);
      console.log('Invalid Account Type');
      return res.status(400).json({ message: 'Invalid account_type' });
    }

    await executeQuery(req.db, categoryQuery, categoryQueryValues);

    // Commit the transaction if everything is successful
    await executeQuery(req.db, 'COMMIT', []);

    const fetchCategoryQuery = `
      SELECT * FROM ${categoryTableName} WHERE user_id = ?
    `;

    const categoryDataResult = await executeQuery(req.db, fetchCategoryQuery, [
      user_id,
    ]);

    const user = {
      user_id: user_id,
      account_type: account_type,
      category_data: categoryDataResult[0],
    };

    createSendToken(user, 201, res);
  } catch (error) {
    // Rollback the transaction in case of any error
    await executeQuery(req.db, 'Some Other Error Rollbacking', []);
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const users = await executeQuery(
        req.db,
        'SELECT * FROM user WHERE email = ?',
        [email]
      );

      if (users.length > 0) {
        const user = users[0];

        const match = await argon2.verify(user.password, password);

        if (match) {
          console.log("User authenticated successfully");
          createSendToken(user, 200, res);
        } else {
          console.log("Incorrect email or password");
          res.status(401).json({ error: 'Incorrect Email or password' });
        }
      } else {
        console.log("User not found");
        res.status(401).json({ error: 'Incorrect Email or password' });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    console.log("Missing email or password");
    res.status(400).json({ error: 'Missing email or password' });
  }
};


exports.protect = async (req, res, next) => {
  let token;
  console.log(req.cookie);
  if(req.headers.cookie){
    token = req.headers.cookie.split('jwt=')[1].split(';')[0];
    console.log("Token: " + token);
  }
  else {
    console.log("jdf");
    console.log(`no jwt cookie`)
    return res.status(401).json({ error: 'You are not logged in' });
  }
  
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer')
  // ) {
  //   token = req.headers.authorization.split(' ')[1];
  // }
  // else {
  //   console.log('No req headers auth')
  // }

  if (!token) {
    console.log('No token')
    return res.status(401).json({ error: 'You are not logged in' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, 'my-ultra-secret');

    const protectQuery = `SELECT * FROM user WHERE user_id = ?`;
    const protectQueryValues = [decoded.user_id];
    const user = await executeQuery(req.db, protectQuery, protectQueryValues);

    if (!user.length) {
      console.log('No user length')
      return res.status(401).json({ error: 'The user no longer exists' });
    }

    req.user = user[0];
    next();
  } catch (error) {
    console.log('Some Internal Error')
    res.status(500).json({ error: 'Internal server error' });
  }
};

// exports.restrictTo = (...allowedUserTypes) => {
//   return (req, res, next) => {
//     if (!allowedUserTypes.includes(req.user.account_type)) {
//       return res.status(403).json({
//         error: 'Your account type does not support this functionality',
//       });
//     }
//     console.log("SUCCESS FROM RESTRICT TO FUNCTION")
//     next();
//   };
// };

// exports.authorize = () => {
//   return (req, res, next) => {
//     if (req.user.user_id === req.params.user_id) {
//       console.log("SUCCESS FROM AUTHORIZE FUNCTION")
//       next();
//     } else {
//       res.status(403).json({ error: 'You are not authorized' });
//     }
//   };
// };

exports.logout = (req, res) => {
  // Clear the JWT token from the client's cookies
  res.clearCookie('jwt');
  console.log("Cleared")
  res.status(200).json({ status: 'success' });
};


exports.accountType = async (req, res) => {
  const userId = req.params.id;

  const userTypeQuery = 'SELECT account_type FROM user WHERE user_id = ?';

  try {
    const result = await executeQuery(req.db, userTypeQuery, [userId]);

    if (result.length === 0) {
      // User not found
      return res.status(404).json({ error: 'User not found' });
    }

    const accountType = result[0].account_type;
    res.json({ accountType: accountType });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

