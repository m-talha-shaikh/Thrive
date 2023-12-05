const executeQuery = require('./../utils/executeQuery');

exports.getJob = async (req, res, next) => {
  const job_id = req.params.job_id;

  const jobQuery = `SELECT
                      j.*,
                      o.name,
                      u.ProfilePic
                  FROM
                      jobs j
                  JOIN
                      organization o ON j.organization_id = o.organization_id
                  JOIN
                      user u ON o.user_id = u.user_id
                  WHERE
                      j.job_id = ?`;

  try {
    const queryTasks = [executeQuery(req.db, jobQuery, [job_id])];

    const results = await Promise.all(queryTasks);

    const jobRecord = {
      job: results[0][0],
    };

    res.json({
      job: jobRecord,
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.getApplicants = async (req, res, next) => {
  const job_id = req.params.job_id;

  const jobQuery = `SELECT * FROM job_applications J
                                WHERE J.job_id = ?`;

  try {
    const queryTasks = [executeQuery(req.db, jobQuery, [job_id])];

    const results = await Promise.all(queryTasks);

    const jobRecord = {
      job: results[0][0],
    };

    res.json({
      job: jobRecord,
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.getJobs = async (req, res, next) => {
  console.log(req.query);
  const {
    keyword,
    min_salary,
    max_salary,
    country,
    remote,
    job_type,
  } = req.query;
  
  const filters = [];
  const queryValues = [];

  let searchQuery = `
    SELECT J.*, O.name AS organization_name, U.ProfilePic FROM jobs J JOIN organization O ON J.organization_id = O.organization_id JOIN user U ON O.user_id = U.user_id WHERE 1
  `;

  if (keyword) {
    console.log("Yay");
    searchQuery += ` AND MATCH (J.title, J.description) AGAINST (? IN NATURAL LANGUAGE MODE)`;
    filters.push(keyword);
    console.log(filters);
  }

  if (min_salary && !isNaN(parseInt(min_salary, 10))) {
    searchQuery += ` AND J.salary_min >= ?`;
    filters.push(min_salary);
  }

  if (max_salary && !isNaN(parseInt(max_salary, 10))) {
    searchQuery += ` AND J.salary_max <= ?`;
    filters.push(max_salary);
  }

  if (country) {
    searchQuery += ` AND J.country = ?`;
    filters.push(country);
  }

  if (remote == 'true') {
    searchQuery += ` AND J.remote_work = ?`;
    filters.push(remote === 'yes' ? 1 : 0);
  }

  if (job_type) {
    console.log(job_type);
  }

  console.log(filters);
  console.log(searchQuery);

  try {
    const results = await executeQuery(req.db, searchQuery, [
      ...queryValues,
      ...filters,
    ]);
    console.log(results);

    res.json(results);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.applyToJob = async (req, res, next) => {
  const user_id = req.body.user_id;
  const job_id = req.params.job_id;

  // Assuming there's a column named 'person_id' in the 'Person' table
  // const selectPersonIdQuery = `
  //   SELECT person_id FROM Person WHERE user_id = ?
  // `;

  // const personIdValues = [user_id];

  try {
    // Retrieve person_id from the Person table
    // const personResult = await executeQuery(
    //   req.db,
    //   selectPersonIdQuery,
    //   personIdValues
    // );

    // if (personResult.length === 0) {
    //   // If no person_id is found, handle the error
    //   res.status(404).json({ error: 'Person not found for the given user_id' });
    //   return;
    // }

    // const person_id = personResult[0].person_id;

    // Insert into job_applications table
    const application_date = new Date();
    const insertApplicationQuery = `
      INSERT INTO job_applications (user_id, job_id, application_date)
      VALUES (?, ?, ?)
    `;

    const queryValues = [user_id, job_id, application_date];

    const result = await executeQuery(
      req.db,
      insertApplicationQuery,
      queryValues
    );

    if (result.affectedRows === 1) {
      res
        .status(201)
        .json({ message: 'Job application submitted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to apply for the job' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

