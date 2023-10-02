const executeQuery = require('./../utils/executeQuery')

exports.getInstitute = async(req, res, next) => {
    const institute_id = req.params.institute_id;

    const basicInfoQuery = `SELECT I.name, I.institute_type,
                                    I.description, I.website_url, I.contact,
                                L.city, L.state, L.country
                                FROM institute I
                                JOIN location L
                                ON I.location_id = L.location_id
                                WHERE I.institute_id = ${institute_id}
                          `;
                         

    try {
      const queryTasks = [
        executeQuery(req.db, basicInfoQuery, [institute_id])
    ];

      const results = await Promise.all(queryTasks);

      const instituteProfile = {
        institute: results[0][0],
      };

      res.json(instituteProfile);

    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error });
    }

};

               

