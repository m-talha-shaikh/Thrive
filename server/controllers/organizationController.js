const executeQuery = require('./../utils/executeQuery')

exports.getOrganization = async(req, res, next) => {
    const user_id = req.params.user_id;

    const basicInfoQuery = `SELECT O.name, O.industry,
                                O.description, O.website_url, O.contact,
                                L.city, L.state, L.country
                                FROM organization O
                                JOIN location L
                                ON O.location_id = L.location_id
                                WHERE O.user_id = ${user_id}
                          `;                          
                         

    try {
      const queryTasks = [
        executeQuery(req.db, basicInfoQuery, [user_id])
    ];

      const results = await Promise.all(queryTasks);

      const organizationProfile = {
        organization: results[0][0],
      };

      res.json(organizationProfile);

    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error });
    }

};

exports.getEmployees = async(req, res, next) => {
    const organization_user_id = req.params.user_id;

    const employeesQuery = `SELECT  P.first_name, P.last_name,
                                    E.title
                                    FROM person P
                                    JOIN employment E
                                    ON   P.person_id = E.person_id
                                    WHERE E.organization_id = (SELECT organization_id
                                                              FROM organization O
                                                              WHERE user_id =  ${organization_user_id})
                          `;                          
                         

    try {
      const queryTasks = [
        executeQuery(req.db, employeesQuery , [organization_user_id])
    ];

      const results = await Promise.all(queryTasks);

      const employees = {
        employees: results[0],
      };

      res.json(employees);

    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error });
    }

};

               

