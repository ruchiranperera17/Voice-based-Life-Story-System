import users from "../models/responses.js";

const getResponses = async (req, res) => {
  try {
    const responses = await users.find();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving responses" });
  }
};

export default getResponses;
