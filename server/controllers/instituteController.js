const executeQuery = require('./../utils/executeQuery')

exports.getInstitute = async(req, res, next) => {
    const user_id = req.params.user_id;

    const basicInfoQuery = `SELECT I.name, I.institute_type,
                                I.description, I.website_url, I.contact,
                                L.city, L.state, L.country
                                FROM institute I
                                JOIN location L
                                ON I.location_id = L.location_id
                                WHERE I.user_id = ?`
                         

    try {
      const queryTasks = [
        executeQuery(req.db, basicInfoQuery, [user_id])
    ];

      const results = await Promise.all(queryTasks);

      const instituteProfile = {
        institute: results[0][0],
      };

      res.json({
        "institute": instituteProfile
      });

    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error });
    }

};


exports.getAffiliates = async(req, res, next) => {
    const institute_user_id = req.params.user_id;

    const affiliatesQuery = `SELECT P.first_name, P.last_name,
                                    E.major
                                    FROM person P
                                    JOIN education E
                                    ON   P.person_id = E.person_id
                                    WHERE E.institute_id = (SELECT institute_id
                                                              FROM institute O
                                                              WHERE user_id =  ? )
                          `;                          
                         

    try {
      const queryTasks = [
        executeQuery(req.db, affiliatesQuery , [institute_user_id])
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
               

