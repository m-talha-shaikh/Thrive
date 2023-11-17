const executeQuery = require('./../utils/executeQuery');

exports.getJob = async (req, res, next) => {
  const job_id = req.params.job_id;

  const jobQuery = `SELECT * FROM jobs J
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
    SELECT * FROM jobs
    WHERE 1
  `;

  if (keyword) {
    searchQuery += ` AND MATCH (title, description) AGAINST (? IN NATURAL LANGUAGE MODE)`;
    filters.push(keyword);
  }

  if (min_salary) {
    searchQuery += ` AND salary_min >= ?`;
    filters.push(min_salary);
  }

  if (max_salary) {
    searchQuery += ` AND salary_max <= ?`;
    filters.push(max_salary);
  }

  if (country) {
    searchQuery += ` AND country = ?`;
    filters.push(country);
  }

  if (remote == true) {
    searchQuery += ` AND remote_work = ?`;
    filters.push(remote === 'yes' ? 1 : 0);
  }

  if (job_type && job_type.length > 0) {
    searchQuery += ' AND (';

    job_type.forEach((type, index) => {
      if (index > 0) {
        searchQuery += ' OR ';
      }

      searchQuery += `job_type = ?`;
      filters.push(type);
    });

    searchQuery += ')';
  }

  try {
    const results = await executeQuery(req.db, searchQuery, [
      ...queryValues,
      ...filters,
    ]);

    res.json(results);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error });
  }
};

exports.applyToJob = async (req, res, next) => {
  const user_id = req.params.user_id;
  const job_id = req.params.job_id;

  const application_date = new Date();

  const insertApplicationQuery = `
    INSERT INTO job_applications (user_id, job_id, application_date)
    VALUES (?, ?, ?)
  `;

  const queryValues = [user_id, job_id, application_date];

  try {
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
