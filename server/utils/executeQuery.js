function executeQuery(db, query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, result) => {
      if (error) {
        console.log("andh shiudh middleware");
        reject(error);
      } else {
        console.log("andh shiudh middleware");

        resolve(result);
      }
    });
  })};

module.exports = executeQuery;