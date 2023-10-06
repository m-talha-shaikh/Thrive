const executeQuery = require('./../utils/executeQuery')

exports.getOrganization = async(req, res, next) => {
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
      const queryTasks = [
        executeQuery(req.db, basicInfoQuery, [user_id])
    ];

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
    country
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
    user_id
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, updateOrganizationQuery, queryValues),
    ];

    await Promise.all(queryTasks);

    res.json({ message: "Organization updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};


exports.getEmployees = async(req, res, next) => {
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
        executeQuery(req.db, employeesQuery , [organization_user_id])
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


exports.getJobs = async(req, res, next) => {
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
        executeQuery(req.db, jobsQuery , [organization_user_id])
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
  const user_id = req.user.user_id;

  post_date = Date.now();

  const {
  organization_id,
  title,
  description,
  requirements,
  expiry_date,
  is_active
  } = req.body;

  const insertJobQuery = `
    INSERT INTO education(organization_id, title, description, requirements, post_date,  expiry_date, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const queryValues = [
  organization_id,
  title,
  description,
  requirements,
  post_date,
  expiry_date,
  is_active
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, insertJobQuery, queryValues),
    ];

    const results = await Promise.all(queryTasks);

    const jobRecord = {
      jobRecord: results[0][0],
    };

    res.json(jobRecord);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};

exports.updateJob = async (req, res, next) => {
  const user_id = req.user.user_id;
  const job_id = req.params.job_id || req.body.job_id;

  const {
    title,
    description,
    requirements,
    expiry_date,
    is_active,
  } = req.body;

  const updateJobQuery = `
    UPDATE education
    SET  title = ?, description = ?, requirements = ?,
        expiry_date = ?, is_active = ?
    WHERE job_id = ? AND organization_id = (SELECT organization_id
                                            FROM organization O
                                            WHERE user_id =  ? )
  `;

  const queryValues = [
    title,
    description,
    requirements,
    expiry_date,
    is_active,
    job_id,
    user_id
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, updateJobQuery, queryValues),
    ];

    const results = await Promise.all(queryTasks);

    const jobRecord = {
      jobRecord: results[0][0],
    };

    res.json(jobRecord);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};


exports.deleteJob = async (req, res, next) => {
  const user_id = req.user.user_id;
  const job_id = req.params.job_id || req.body.job_id;

  const deleteJobQuery = `
    DELETE FROM education
    WHERE job_id = ? AND organization_id = (SELECT organization_id
                                            FROM organization O
                                            WHERE user_id = ?)
  `;

  const queryValues = [job_id, user_id];

  try {
    const queryTasks = [
      executeQuery(req.db, deleteJobQuery, queryValues),
    ];

    await Promise.all(queryTasks);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};
