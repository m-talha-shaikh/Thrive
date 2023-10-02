const executeQuery = require('./../utils/executeQuery')

exports.getPerson = async(req, res, next) => {
    const personId = req.params.personId;

    const basicInfoQuery = `SELECT P.first_name, P.last_name,
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

    const employmentQuery = `SELECT O.name, L.city, L.state, L.country,
                                   E.year_started, E.year_left,
                                   E.month_started, E.month_left,
                                   E.title, E.text_description 
                                   FROM employment E
                                   JOIN organization O
                                   ON O.organization_id = E.organization_id
                                   JOIN location L
                                   ON O.location_id = L.location_id
                                   WHERE E.person_id = ${personId}
                          `;

    const certificationQuery = `SELECT C.name, C.issuing_organization,
                                C.issue_date, C.expiration_date
                                FROM certifications C
                                WHERE C.person_id = ${personId}`
                     

    try {
      const queryTasks = [
        executeQuery(req.db, basicInfoQuery, [personId]),
        executeQuery(req.db, educationQuery, [personId]),
        executeQuery(req.db, certificationQuery, [personId])
    ];

      const results = await Promise.all(queryTasks);


      const userProfile = {
        person: results[0][0],
        education: results[1],
        certifications: results[2],

      };

      res.json(userProfile);

    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error });
    }

};

               

