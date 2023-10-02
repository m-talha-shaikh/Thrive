function executeQuery(db, query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  })}; 



exports.getInstitute = async(req, res, next) => {
    const instituteId = req.params.instituteId;

    const basicInfoQuery = `SELECTi I.name, I.institute_type,
                                    I.description, I.website_url, I.contact,
                                L.city, L.state, L.country
                                FROM Institute I
                                JOIN location L
                                ON I.location_id = L.location_id
                                WHERE I.institute_id = ${instituteId}
                          `;
                         

    try {
      const queryTasks = [
        executeQuery(req.db, basicInfoQuery, [instituteId])
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

               

