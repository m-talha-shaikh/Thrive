const executeQuery = require('./../utils/executeQuery')

exports.getPerson = async(req, res, next) => {
    const person_id = req.params.person_id;

    const basicInfoQuery = `SELECT P.first_name, P.last_name,
                                L.city, L.state, L.country
                                FROM person P
                                JOIN location L
                                ON P.location_id = L.location_id
                                WHERE P.person_id = ${person_id}
                          `;

    const educationQuery = `SELECT I.name, L.city, L.state, L.country,
                                   E.year_enrolled, E.year_graduated,
                                   E.major, E.currently_studying, E.text_description 
                                   FROM education E
                                   JOIN institute I
                                   ON I.institute_id = E.institute_id
                                   JOIN location L
                                   ON I.location_id = L.location_id
                                   WHERE E.person_id = ${person_id}
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
                                   WHERE E.person_id = ${person_id}
                          `;

    const certificationQuery = `SELECT C.name, C.issuing_organization,
                                C.issue_date, C.expiration_date
                                FROM certifications C
                                WHERE C.person_id = ${person_id}`
                     

    try {
      const queryTasks = [
        executeQuery(req.db, basicInfoQuery, [person_id]),
        executeQuery(req.db, educationQuery, [person_id]),
        executeQuery(req.db, certificationQuery, [person_id])
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


exports.createEducation = async(req, res, next) => {
  const person_id = req.params.person_id;

  const { institute_id, year_enrolled, year_graduated, major, currently_studying, text_description } = req.body;

  const insertEducationQuery = `
    INSERT INTO education(person_id, institute_id, year_enrolled, year_graduated, major, currently_studying, text_description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const queryValues = [
    person_id,
    institute_id,
    year_enrolled,
    year_graduated,
    major,
    currently_studying,
    text_description,
  ];

  try {
      const queryTasks = [
        executeQuery(req.db, insertEducationQuery, queryValues)
    ];

    const results = await Promise.all(queryTasks);


      const educationRecord = {
        educationRecord: results[0][0],
      };

      res.json(educationRecord);
    
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error });
    }

};

               

