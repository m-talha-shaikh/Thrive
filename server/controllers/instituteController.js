const executeQuery = require('./../utils/executeQuery');

exports.getInstitute = async (req, res, next) => {
  const user_id = req.params.user_id;

  const basicInfoQuery = `SELECT U.user_id, U.username, U.ProfilePic, U.CoverPic,
                                I.name, I.institute_type,
                                I.description, I.website_url, I.contact,
                                L.city, L.state, L.country
                                FROM institute I
                                JOIN location L
                                ON I.location_id = L.location_id
                                JOIN user U
                                ON I.user_id = U.user_id
                                WHERE I.user_id = ?`;

  try {
    const queryTasks = [executeQuery(req.db, basicInfoQuery, [user_id])];

    const results = await Promise.all(queryTasks);

    const instituteProfile = {
      institute: results[0][0],
    };

    res.json({
      institute: instituteProfile,
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.getAffiliates = async (req, res, next) => {
  const institute_user_id = req.params.user_id;

  const affiliatesQuery = `SELECT   U.ProfilePic, P.user_id, P.first_name, P.last_name,
                                    E.major
                                    FROM person P
                                    JOIN education E
                                    ON   P.person_id = E.person_id
                                    JOIN user U
                                    ON U.user_id = P.user_id
                                    WHERE E.institute_id = (SELECT institute_id
                                                              FROM institute O
                                                              WHERE user_id =  ? )
                          `;

  try {
    const queryTasks = [
      executeQuery(req.db, affiliatesQuery, [institute_user_id]),
    ];

    const results = await Promise.all(queryTasks);

    const affiliates = {
      affiliates: results[0],
    };

    res.json(affiliates);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};



exports.updateInstitute = async (req, res, next) => {
  const user_id = req.params.user_id;

  // console.log(req.body);
  const {
    name,
    institute_type,
    description,
    website_url,
    contact,
    city,
    state,
    country,
    ProfilePic,
    CoverPic,
  } = req.body;

  // Check if the location already exists
  const checkLocationQuery = `
    SELECT location_id FROM location WHERE city = ? AND state = ? AND country = ?
  `;

  const locationCheckValues = [city, state, country];

  const checkLocationResult = await executeQuery(req.db, checkLocationQuery, locationCheckValues);

  let location_id;

  if (checkLocationResult.length > 0) {
    // Location exists, use existing location_id
    location_id = checkLocationResult[0].location_id;
  } else {
    // Location doesn't exist, create a new location and get the new location_id
    const createLocationQuery = `
      INSERT INTO location (city, state, country) VALUES (?, ?, ?)
    `;

    const createLocationValues = [city, state, country];

    const createLocationResult = await executeQuery(req.db, createLocationQuery, createLocationValues);
    location_id = createLocationResult.insertId;
  }

  const updateInstituteQuery = `
    UPDATE institute I
    SET 
      I.name = ?,
      I.institute_type = ?, 
      I.description = ?,
      I.website_url = ?,
      I.contact = ?,
      I.location_id = ?
    WHERE I.user_id = ?
  `;

  const updateUserQuery = `
    UPDATE user U
    SET U.ProfilePic = ?,
        U.CoverPic = ?
    WHERE U.user_id = ?
  `;

  const instituteQueryValues = [
    name,
    institute_type,
    description,
    website_url,
    contact,
    location_id,
    user_id,
  ];

  const userQueryValues = [ProfilePic, CoverPic, user_id];

  try {
    // Update Institute
    const instituteUpdateResult = await executeQuery(req.db, updateInstituteQuery, instituteQueryValues);
    // console.log('Institute Update Result:', instituteUpdateResult);

    // Update User
    const userUpdateResult = await executeQuery(req.db, updateUserQuery, userQueryValues);
    // console.log('User Update Result:', userUpdateResult);

    res.json({ message: 'Institute and user updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};
