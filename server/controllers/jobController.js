const executeQuery = require('./../utils/executeQuery')

exports.getJob = async(req, res, next) => {
    const job_id = req.params.job_id;

    const jobQuery = `SELECT * FROM jobs J
                                WHERE J.job_id = ?`
                         
    try {
      const queryTasks = [
        executeQuery(req.db, jobQuery, [job_id])
    ];

      const results = await Promise.all(queryTasks);

      const jobRecord = {
        job: results[0][0],
      };

      res.json({
        "job": jobRecord
      });

    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error });
    }

};