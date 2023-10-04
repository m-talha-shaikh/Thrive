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

               

