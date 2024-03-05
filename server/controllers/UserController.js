const executeQuery = require('./../utils/executeQuery');

exports.searchUsers = async (req, res) => {
    const { query } = req.query;
    console.log("User search");
    try {
        const users = await executeQuery(req.db,
            'SELECT * FROM user WHERE username LIKE ?',
            [`%${query}%`]
        );
        // console.log(users);
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
