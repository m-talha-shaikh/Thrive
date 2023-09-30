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

exports.getPerson = async(req, res, next) => {
    const personId = req.params.personId;

    const basicInfoQuery = `SELECTgi P.first_name, P.last_name,
                                L.city, L.state, L.country
                                FROM person P
                                JOIN location L
                                ON P.location_id = L.location_id
                                WHERE P.person_id = ${personId}
                          `;

    const educationQuery = `SELECT I.name, L.city, L.state, L.country,
                                   E.year_enrolled, E.year_graduated,
                                   E.major, E.currently_studying, E.text_description 
                                   FROM education E
                                   JOIN institute I
                                   ON I.institute_id = E.institute_id
                                   JOIN location L
                                   ON I.location_id = L.location_id
                                   WHERE E.person_id = ${personId}
                          `;              
                         

    try {
      const queryTasks = [
        executeQuery(req.db, basicInfoQuery, [personId]),
        executeQuery(req.db, educationQuery, [personId]),
    ];

      const results = await Promise.all(queryTasks);

      const userProfile = {
        person: results[0][0],
        education: results[1],
      };

      console.log(userProfile);
      res.json(userProfile);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error });
    }

};

               

