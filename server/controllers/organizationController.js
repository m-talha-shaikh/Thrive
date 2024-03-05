const executeQuery = require('./../utils/executeQuery');

exports.getOrganization = async (req, res, next) => {
  const user_id = req.params.user_id;

  const basicInfoQuery = `SELECT U.user_id, U.ProfilePic, U.CoverPic, U.username, O.name, O.industry,
                                O.description, O.website_url, O.contact,
                                L.city, L.state, L.country
                                FROM organization O
                                JOIN location L
                                ON O.location_id = L.location_id
                                JOIN user U
                                ON O.user_id = U.user_id
                                WHERE O.user_id = ?
                          `;

  try {
    const queryTasks = [executeQuery(req.db, basicInfoQuery, [user_id])];

    const results = await Promise.all(queryTasks);

    const organizationProfile = {
      organization: results[0][0],
    };

    res.json(organizationProfile);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.updateOrganization = async (req, res, next) => {
  const user_id = req.params.user_id;


  const {
    name,
    industry,
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

  const updateOrganizationQuery = `
    UPDATE organization O
    SET 
      O.name = ?,
      O.industry = ?,
      O.description = ?,
      O.website_url = ?,
      O.contact = ?,
      O.location_id = ?
    WHERE O.user_id = ?
  `;

  const updateUserQuery = `
    UPDATE user U
    SET U.ProfilePic = ?,
        U.CoverPic = ?
    WHERE U.user_id = ?
  `;

  const organizationQueryValues = [
    name,
    industry,
    description,
    website_url,
    contact,
    location_id,
    user_id,
  ];

  const userQueryValues = [ProfilePic, CoverPic, user_id];

  try {
    // Update Organization
    const organizationUpdateResult = await executeQuery(req.db, updateOrganizationQuery, organizationQueryValues);
    // console.log('Organization Update Result:', organizationUpdateResult);

    // Update User
    const userUpdateResult = await executeQuery(req.db, updateUserQuery, userQueryValues);
    // console.log('User Update Result:', userUpdateResult);

    res.json({ message: 'Organization and user updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};




exports.getEmployees = async (req, res, next) => {
  const organization_user_id = req.params.user_id;

  const employeesQuery = `SELECT   U.ProfilePic, P.user_id, P.first_name, P.last_name,
                                    E.title
                                    FROM person P
                                    JOIN employment E
                                    ON   P.person_id = E.person_id
                                    JOIN user U
                                    ON P.user_id = U.user_id
                                    WHERE E.organization_id = (SELECT organization_id
                                                              FROM organization O
                                                              WHERE user_id =  ? )
                          `;

  try {
    const queryTasks = [
      executeQuery(req.db, employeesQuery, [organization_user_id]),
    ];

    const results = await Promise.all(queryTasks);
    const employees = {
      employees: results[0],
    };

    res.json(employees);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.getJobs = async (req, res, next) => {
  const organization_user_id = req.params.user_id;

  const jobsQuery = `SELECT  *
                              FROM jobs J
                              WHERE J.organization_id = (SELECT organization_id
                                                          FROM organization O
                                                          WHERE user_id =  ? )
                              AND is_active = true
                              ORDER BY post_date DESC;
                          `;

  try {
    const queryTasks = [
      executeQuery(req.db, jobsQuery, [organization_user_id]),
    ];

    const results = await Promise.all(queryTasks);

    const jobs = {
      jobs: results[0],
    };

    res.json(jobs);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.createJob = async (req, res, next) => {

  const user_id = req.params.user_id;
  const post_date = new Date();

 let {
    title,
    description,
    expiry_date,
    is_active,
    salary_min,
    salary_max,
    country,
    job_type,
    openings,
    remote_work,
  } = req.body;

  // console.log(post_date);
  const formattedExpiryDate = new Date(expiry_date).toISOString().slice(0, 19).replace("T", " ");
  if(salary_min == ''){
    salary_min = null;
  }
  if(salary_max == ''){
    salary_max = null;
  }

  if(openings == ''){
    openings = null;
  }


  const retrieveOrgIdQuery = `
    SELECT organization_id
    FROM organization
    WHERE user_id = ?
  `;

  try {
    const orgIdResult = await executeQuery(req.db, retrieveOrgIdQuery, [
      user_id,
    ]);
    if (orgIdResult && orgIdResult.length > 0) {
      const organization_id = orgIdResult[0].organization_id;
      const insertJobQuery = `
        INSERT INTO jobs(organization_id, title, description, post_date, expiry_date, is_active, salary_min, salary_max, country, job_type, openings, remote_work)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const queryValues = [
        organization_id,
        title,
        description,
        post_date,
        formattedExpiryDate,
        is_active,
        salary_min,
        salary_max,
        country,
        job_type,
        openings,
        remote_work,
      ];

      const results = await executeQuery(req.db, insertJobQuery, queryValues);

      if (results && results.insertId) {
        const jobRecord = {
          job_id: results.insertId,
        };

        res.json(jobRecord);
      } else {
        res.status(500).json({ error: 'Failed to insert the job' });
      }
    } else {
      res
        .status(500)
        .json({ error: 'Organization not found for the given user_id' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.updateJob = async (req, res, next) => {
  const user_id = req.params.user_id;
  const job_id = req.params.job_id || req.body.job_id;

  const {
    title,
    description,
    expiry_date,
    is_active,
    salary_min,
    salary_max,
    country,
    job_type,
    openings,
    remote_work,
  } = req.body;

  const retrieveOrgIdQuery = `
    SELECT organization_id
    FROM organization
    WHERE user_id = ?
  `;

  try {
    const orgIdResult = await executeQuery(req.db, retrieveOrgIdQuery, [user_id]);

    if (orgIdResult && orgIdResult.length > 0) {
      const organization_id = orgIdResult[0].organization_id;

      const updateJobQuery = `
        UPDATE jobs
        SET title = ?, description = ?,
            expiry_date = ?, is_active = ?, salary_min = ?,
            salary_max = ?, country = ?, job_type = ?,
            openings = ?, remote_work = ?
        WHERE job_id = ? AND organization_id = ?
      `;

      const queryValues = [
        title,
        description,
        expiry_date,
        is_active,
        salary_min,
        salary_max,
        country,
        job_type,
        openings,
        remote_work,
        job_id,
        organization_id,
      ];

      const results = await executeQuery(req.db, updateJobQuery, queryValues);

        res.json({
          status : "success"
        });

    } else {
      res.status(500).json({ error: 'Organization not found for the given user_id' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' }); // Respond with a generic error message
  }
};


exports.deleteJob = async (req, res, next) => {
  const user_id = req.params.user_id;
  const job_id = req.params.job_id || req.body.job_id;

  const deleteJobQuery = `
    DELETE FROM jobs
    WHERE job_id = ? AND organization_id = (SELECT organization_id
                                            FROM organization O
                                            WHERE user_id = ?)
  `;

  const queryValues = [job_id, user_id];

  try {
    const queryTasks = [executeQuery(req.db, deleteJobQuery, queryValues)];

    await Promise.all(queryTasks);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};
