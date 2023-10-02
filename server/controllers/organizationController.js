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

exports.getOrganization = async(req, res, next) => {
    const organizationId = req.params.organizationId;

    const basicInfoQuery = `SELECTi O.name, O.industry,
                                    O.description, O.website_url, O.contact,
                                L.city, L.state, L.country
                                FROM Organization O
                                JOIN location L
                                ON O.location_id = L.location_id
                                WHERE P.organization_id = ${organizationId}
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

               

