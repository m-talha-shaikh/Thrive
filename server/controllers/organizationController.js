const executeQuery = require('./../utils/executeQuery')

exports.getOrganization = async(req, res, next) => {
    const organizationId = req.params.organizationId;

    const basicInfoQuery = `SELECT O.name, O.industry,
                                    O.description, O.website_url, O.contact,
                                L.city, L.state, L.country
                                FROM organization O
                                JOIN location L
                                ON O.location_id = L.location_id
                                WHERE O.organization_id = ${organizationId}
                          `;
                         

    try {
      const queryTasks = [
        executeQuery(req.db, basicInfoQuery, [organizationId])
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

               

