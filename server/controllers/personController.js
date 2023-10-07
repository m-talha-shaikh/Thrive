const executeQuery = require("./../utils/executeQuery");

exports.getPerson = async (req, res, next) => {
  const user_id = req.params.user_id;

  const basicInfoQuery = `
    SELECT P.first_name, P.last_name,
      L.city, L.state, L.country
    FROM person P
    JOIN location L
    ON P.location_id = L.location_id
    WHERE P.user_id = ?`;

  const educationQuery = `
    SELECT I. institute_id, I.name, L.city, L.state, L.country,
      E.year_enrolled, E.year_graduated,
      E.major, E.currently_studying, E.text_description 
    FROM education E
    JOIN institute I
    ON I.institute_id = E.institute_id
    JOIN location L
    ON I.location_id = L.location_id
    WHERE E.person_id = (SELECT person_id
      FROM person P
      WHERE P.user_id = ?)`;

  const employmentQuery = `
    SELECT O.organization_id, O.name, L.city, L.state, L.country,
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
      WHERE P.user_id = ?)`;

  const certificationQuery = `
    SELECT C.name, C.issuing_organization,
      C.issue_date, C.expiration_date
    FROM certifications C
    WHERE C.person_id = (SELECT person_id
      FROM person P
      WHERE P.user_id = ?)`;

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
    institute_name,
  } = req.body;

  const check_institute = "SELECT institute_id FROM institute WHERE name = ?";

  const insertEducationQuery = `
    INSERT INTO education(institute_id, year_enrolled, year_graduated, major, currently_studying, text_description)
    VALUES (?, ?, ?, ?, ?, ?)`;

  let institute_id;



  try {

      let institute = await executeQuery(req.db, check_institute, [institute_name]);


    if (institute.length === 0) {
      const instituteResult = await executeQuery(req.db, `INSERT INTO institute (name) VALUES (?);`, [institute_id]);
      institute_id = instituteResult.insertId;
    } else {
      institute_id = institute[0].institute_id;
    }


      const queryValues = [
    institute_id,
    year_enrolled,
    year_graduated,
    major,
    currently_studying,
    text_description,
  ];

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
    INSERT INTO certifications(certification_id, name, issuing_organization, issue_date, expiration_date)
    VALUES (?, ?, ?, ?, ?)`;

  const queryValues = [
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
    person_id,
    year_started,
    month_left,
    year_left,
    title,
    text_description,
    organization_name,
  } = req.body;

  const check_organization = "SELECT organization_id FROM organization WHERE name = ?";

  const insertEmploymentQuery = `
    INSERT INTO employment(person_id, organization_id, year_started, month_left, year_left, title, text_description)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  let organization_id;



  try {

      let organization = await executeQuery(req.db, check_organization, [organization_name]);


    if (organization.length === 0) {
      const organizationResult = await executeQuery(req.db, `INSERT INTO organization (name) VALUES (?);`, [organization_id]);
      organization_id = organizationResult.insertId;
    } else {
      organization_id = organization[0].organization_id;
    }


      const queryValues = [
        person_id,
    organization_id,
    year_started,
    month_left,
    year_left,
    title,
    text_description,
  ];
  
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

exports.updateEducation = async (req, res, next) => {
  const user_id = req.user.user_id;
  const education_id = req.params.education_id || req.body.education_id;

  const {
    year_enrolled,
    year_graduated,
    major,
    currently_studying,
    text_description,
    institute_id,
  } = req.body;

  const updateEducationQuery = `
    UPDATE education
    SET institute_id = ?, year_enrolled = ?, year_graduated = ?,
        major = ?, currently_studying = ?, text_description = ?
    WHERE education_id = ? AND person_id = (SELECT person_id
                                            FROM person P
                                            WHERE P.user_id = ?)
  `;

  const queryValues = [
    institute_id,
    year_enrolled,
    year_graduated,
    major,
    currently_studying,
    text_description,
    education_id,
    user_id,
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, updateEducationQuery, queryValues),
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

exports.updateCertification = async (req, res, next) => {
  const user_id = req.user.user_id;
  const certification_id = req.params.certification_id || req.body.certification_id;

  const {
    name,
    issuing_organization,
    issue_date,
    expiration_date,
  } = req.body;

  const updateCertificationQuery = `
    UPDATE certifications
    SET name = ?, issuing_organization = ?, issue_date = ?,
        expiration_date = ?
    WHERE certification_id = ? AND person_id = (SELECT person_id
                                               FROM person P
                                               WHERE P.user_id = ?)
  `;

  const queryValues = [
    name,
    issuing_organization,
    issue_date,
    expiration_date,
    certification_id,
    user_id,
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, updateCertificationQuery, queryValues),
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


exports.updateEmployment = async (req, res, next) => {
  const user_id = req.user.user_id;
  const employment_id = req.params.employment_id || req.body.employment_id;

  const {
    organization_id,
    year_started,
    month_left,
    year_left,
    title,
    text_description,
  } = req.body;

  const updateEmploymentQuery = `
    UPDATE employment
    SET organization_id = ?, year_started = ?, month_left = ?,
        year_left = ?, title = ?, text_description = ?
    WHERE employment_id = ? AND person_id = (SELECT person_id
                                            FROM person P
                                            WHERE P.user_id = ?)
  `;

  const queryValues = [
    organization_id,
    year_started,
    month_left,
    year_left,
    title,
    text_description,
    employment_id,
    user_id,
  ];

  try {
    const queryTasks = [
      executeQuery(req.db, updateEmploymentQuery, queryValues),
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

exports.deleteEducation = async (req, res, next) => {
  const user_id = req.user.user_id;
  const education_id = req.params.education_id || req.body.education_id;

  const deleteEducationQuery = `
    DELETE FROM education
    WHERE education_id = ? AND person_id = (SELECT person_id
                                           FROM person P
                                           WHERE P.user_id = ?)
  `;

  const queryValues = [education_id, user_id];

  try {
    const queryTasks = [
      executeQuery(req.db, deleteEducationQuery, queryValues),
    ];

    await Promise.all(queryTasks);

    res.json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};

exports.deleteCertification = async (req, res, next) => {
  const user_id = req.user.user_id;
  const certification_id = req.params.certification_id || req.body.certification_id;

  const deleteCertificationQuery = `
    DELETE FROM certifications
    WHERE certification_id = ? AND person_id = (SELECT person_id
                                               FROM person P
                                               WHERE P.user_id = ?)
  `;

  const queryValues = [certification_id, user_id];

  try {
    const queryTasks = [
      executeQuery(req.db, deleteCertificationQuery, queryValues),
    ];

    await Promise.all(queryTasks);

    res.json({ message: "Certification deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};



exports.deleteEmployment = async (req, res, next) => {
  const user_id = req.user.user_id;
  const employment_id = req.params.employment_id || req.body.employment_id;

  const deleteEmploymentQuery = `
    DELETE FROM employment
    WHERE employment_id = ? AND person_id = (SELECT person_id
                                            FROM person P
                                            WHERE P.user_id = ?)
  `;

  const queryValues = [employment_id, user_id];

  try {
    const queryTasks = [
      executeQuery(req.db, deleteEmploymentQuery, queryValues),
    ];

    await Promise.all(queryTasks);

    res.json({ message: "Employment deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error });
  }
};

