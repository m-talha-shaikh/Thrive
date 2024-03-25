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

  const jobQuery = `
    SELECT 
      JA.application_id,
      U.user_id,
      P.first_name,
      P.last_name,
      U.ProfilePic
    FROM 
      job_applications JA
      JOIN user U ON JA.user_id = U.user_id
      JOIN person P ON U.user_id = P.user_id
    WHERE 
      JA.job_id = ?
  `;

  try {
    const results = await executeQuery(req.db, jobQuery, [job_id]);

    const jobRecord = {
      applicants: results,
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
  // console.log(req.query);
  let {
    keyword,
    min_salary,
    max_salary,
    country,
    remote,
    jobType,
  } = req.query;
  
  min_salary =  parseFloat(min_salary);
  max_salary = parseFloat(max_salary);
  
  const filters = [];
  const queryValues = [];

  let searchQuery = `
    SELECT J.*, O.name AS organization_name, U.ProfilePic FROM jobs J JOIN organization O ON J.organization_id = O.organization_id JOIN user U ON O.user_id = U.user_id WHERE 1
  `;

  if (keyword) {
 
    searchQuery += ` AND MATCH (J.title, J.description) AGAINST (? IN NATURAL LANGUAGE MODE)`;
    filters.push(keyword);
    // console.log(filters);
  }

  if (min_salary) {
    searchQuery += ` AND J.salary_min >= ?`;
    filters.push(min_salary);
  }

  if (max_salary) {
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

  if (jobType) {
  const jobTypeConditions = [];
  if (jobType.fullTime === 'true') {
    jobTypeConditions.push('full_time');
  }
  if (jobType.partTime === 'true') {
    jobTypeConditions.push('part_time');
  }
  if (jobType.internship === 'true') {
    jobTypeConditions.push('internship');
  }
  if (jobType.contract === 'true') {
    jobTypeConditions.push('contract');
  }

  if (jobTypeConditions.length > 0) {
    searchQuery += ` AND J.job_type IN (${jobTypeConditions.map(type => `"${type}"`).join(', ')})`;
  }
}


  // console.log(filters);
  // console.log(searchQuery);

  try {
    const results = await executeQuery(req.db, searchQuery, [
      ...queryValues,
      ...filters,
    ]);
    results.forEach((job) => {
    job.salary_min = parseFloat(job.salary_min);
    job.salary_max = parseFloat(job.salary_max);
  });
    // console.log(results);

    res.json(results);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.applyToJob = async (req, res, next) => {
  const user_id = req.body.user_id;
  const job_id = req.params.job_id;

  try {
    const checkExistingQuery = `
      SELECT COUNT(*) AS count
      FROM job_applications
      WHERE user_id = ? AND job_id = ?
    `;

    const checkExistingValues = [user_id, job_id];

    const existingResult = await executeQuery(
      req.db,
      checkExistingQuery,
      checkExistingValues
    );

    if (existingResult[0].count > 0) {
      res.status(400).json({ error: 'Job application already submitted for this user and job' });
    } else {
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
        res.status(201).json({ message: 'Job application submitted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to apply for the job' });
      }
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};


