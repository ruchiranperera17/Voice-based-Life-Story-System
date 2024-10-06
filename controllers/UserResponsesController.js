import Users from "../models/user.js";

const getResponses = async (req, res) => {
  console.log("Test");
  try {
    const responses = await Users.findOne({ _id: "66a5a24db1507dbec0f15541" });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving responses" });
  }
};

export default getResponses;
