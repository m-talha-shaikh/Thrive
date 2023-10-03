const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')

const signToken = user_id => {
    return jwt.sign({ user_id }), process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    }
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.user_id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = async (req, res, next) => {
  const { account_type, username, email, password, ...categoryData } = req.body;

  try {
    const createUserQuery = `
      INSERT INTO users (account_type, username, email, password)
      VALUES (?, ?, ?, ?)
    `;

    const userQueryValues = [account_type, username, email, password];
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
        categoryData.location_id,
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
        categoryData.location_id,
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
        categoryData.location_id,
        categoryData.description,
        categoryData.website_url,
        categoryData.contact,
      ];
    } else {
      // Invalid account_type
      return res.status(400).json({ message: 'Invalid account_type' });
    }

    // Insert data into its table
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
    res.status(500).json({ error: error });
  }
};


// exports.login = async(req, res, next) => {
//     const {email, password} = req.body;

//     if(email != null && password != null){
//         const user = `SELECT * FROM `
//     }
//     else {
//         res.status(404).json({ error: error });
//     }
// }