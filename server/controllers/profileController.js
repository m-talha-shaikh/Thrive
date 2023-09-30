exports.getProfile = async(req, res, next) => {
    const profileId = req.params.profileId;
    const query = `SELECT * FROM user WHERE user_id = ${profileId}`;

    req.db.query(query, [profileId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const user = results[0];

    const userProfile = {
      user_id: user.user_id,
      username: user.username,
      account_type: user.account_type,
      email: user.email,
    };

    console.log(userProfile);
    res.json(userProfile);
  });
}

