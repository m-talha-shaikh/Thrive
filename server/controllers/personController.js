const executeQuery = require("./../utils/executeQuery");

exports.getPerson = async (req, res, next) => {
  const user_id = req.params.user_id;

  const basicInfoQuery = `SELECT P.first_name, P.last_name,
                                L.city, L.state, L.country
                                FROM person P
                                JOIN location L
                                ON P.location_id = L.location_id
                                WHERE P.user_id = ${user_id}
                          `;

  const educationQuery = `SELECT I.name, L.city, L.state, L.country,
                                   E.year_enrolled, E.year_graduated,
                                   E.major, E.currently_studying, E.text_description 
                                   FROM education E
                                   JOIN institute I
                                   ON I.institute_id = E.institute_id
                                   JOIN location L
                                   ON I.location_id = L.location_id
                                   WHERE E.person_id = (SELECT person_id
                                                      FROM person P
                                                      WHERE P.user_id = ${user_id})
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
                                   WHERE E.person_id = (SELECT person_id
                                                      FROM person P
                                                      WHERE P.user_id = ${user_id})
                          `;

  const certificationQuery = `SELECT C.name, C.issuing_organization,
                                C.issue_date, C.expiration_date
                                FROM certifications C
                                   WHERE C.person_id = (SELECT person_id
                                                      FROM person P
                                                      WHERE P.user_id = ${user_id})
                            `;

  try {
    const queryTasks = [
      executeQuery(req.db, basicInfoQuery, [user_id]),
      executeQuery(req.db, educationQuery, [user_id]),
      executeQuery(req.db, certificationQuery, [user_id]),
    ];

    const results = await Promise.all(queryTasks);

    const userProfile = {
      person: results[0][0],
      education: results[1],
      certifications: results[2],
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};

exports.createEducation = async (req, res, next) => {
  const user_id = req.user.user_id;

  const {
    year_enrolled,
    year_graduated,
    major,
    currently_studying,
    text_description,
  } = req.body;

  const insertEducationQuery = `
    INSERT INTO education(institute_id, year_enrolled, year_graduated, major, currently_studying, text_description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const queryValues = [
    institute_id,
    year_enrolled,
    year_graduated,
    major,
    currently_studying,
    text_description,
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, insertEducationQuery, queryValues),
    ];

    const results = await Promise.all(queryTasks);

    const educationRecord = {
      educationRecord: results[0][0],
    };

    res.json(educationRecord);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};

exports.createCertification = async (req, res, next) => {
  const user_id = req.user.user_id;

  const {
    certification_id,
    name,
    issuing_organization,
    issue_date,
    expiration_date,
  } = req.body;

  const insertCertificationQuery = `
    INSERT INTO certification(certification_id,  name , issuing_organization , issue_date , expiration_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const queryValues = [
    user_id,
    certification_id,
    name,
    issuing_organization,
    issue_date,
    expiration_date,
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, insertCertificationQuery, queryValues),
    ];

    const results = await Promise.all(queryTasks);

    const certificationRecord = {
      certificationRecord: results[0][0],
    };

    res.json(certificationRecord);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};

exports.createEmployment = async (req, res, next) => {
  const user_id = req.user.user_id;

  const {
    employment_id,
    organization_id,
    year_started,
    month_left,
    year_left,
    title,
    text_description,
  } = req.body;

  const insertEmploymentQuery = `
    INSERT INTO employment(employment_id , organization_id , year_started , month_left, year_left, title, text_description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const queryValues = [
    employment_id,
    organization_id,
    year_started,
    month_left,
    year_left,
    title,
    text_description,
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, insertEmploymentQuery, queryValues),
    ];

    const results = await Promise.all(queryTasks);

    const employmentRecord = {
      employmentRecord: results[0][0],
    };

    res.json(employmentRecord);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};
