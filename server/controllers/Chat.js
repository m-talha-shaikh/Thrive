const executeQuery = require('../utils/executeQuery');


exports.storeMessage = async (req, res, next) => {


  const { sender_id, receiver_id, message_content } = req.body;

  try {

    let conversation_id;
    const checkConversationQuery = `SELECT conversation_id FROM conversation WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`;
    const conversationResult = await executeQuery(req.db, checkConversationQuery, [sender_id, receiver_id, receiver_id, sender_id]);
    if (conversationResult.length > 0) {

      conversation_id = conversationResult[0].conversation_id;
    } else {

      const createConversationQuery = `INSERT INTO conversation (user1_id, user2_id) VALUES (?, ?)`;
      const createConversationResult = await executeQuery(req.db, createConversationQuery, [sender_id, receiver_id]);
      conversation_id = createConversationResult.insertId;
    }


    const storeMessageQuery = `INSERT INTO message (conversation_id, sender_id, receiver_id, message_content, message_date) 
                             VALUES (?, ?, ?, ?, NOW())`;

    await executeQuery(req.db, storeMessageQuery, [conversation_id, sender_id, receiver_id, message_content]);
    
    res.status(200).json({ message: 'Message stored successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to store message' });
  }
};

exports.getMessages = async (req, res, next) => {
  console.log("Hy")

  const userId1 = req.query.user_id_1;
  const userId2 = req.query.user_id_2;


  const getMessagesQuery = `SELECT m.*, c.conversation_id FROM message m
                            INNER JOIN conversation c ON m.conversation_id = c.conversation_id
                            WHERE (c.user1_id = ? AND c.user2_id = ?) OR (c.user1_id = ? AND c.user2_id = ?)
                            ORDER BY m.message_date`;

  console.log(getMessagesQuery)

  try {

    const messages = await executeQuery(req.db, getMessagesQuery, [userId1, userId2, userId2, userId1]);
    console.log(messages)
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

