const executeQuery = require('./../utils/executeQuery');

exports.getOrganization = async (req, res, next) => {
  const user_id = req.params.user_id;

  const basicInfoQuery = `SELECT O.name, O.industry,
                                O.description, O.website_url, O.contact,
                                L.city, L.state, L.country
                                FROM organization O
                                JOIN location L
                                ON O.location_id = L.location_id
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
  const user_id = req.user.user_id;

  const {
    name,
    industry,
    description,
    website_url,
    contact,
    city,
    state,
    country,
  } = req.body;

  const updateOrganizationQuery = `
    UPDATE organization O
    JOIN location L
    ON O.location_id = L.location_id
    SET O.name = ?, O.industry = ?, O.description = ?,
        O.website_url = ?, O.contact = ?, L.city = ?, L.state = ?, L.country = ?
    WHERE O.user_id = ?
  `;

  const queryValues = [
    name,
    industry,
    description,
    website_url,
    contact,
    city,
    state,
    country,
    user_id,
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, updateOrganizationQuery, queryValues),
    ];

    await Promise.all(queryTasks);

    res.json({ message: 'Organization updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.getEmployees = async (req, res, next) => {
  const organization_user_id = req.params.user_id;

  const employeesQuery = `SELECT  P.first_name, P.last_name,
                                    E.title
                                    FROM person P
                                    JOIN employment E
                                    ON   P.person_id = E.person_id
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
        expiry_date,
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
