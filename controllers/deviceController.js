const User = require("../models/User");

exports.updateStatus = async (req, res) => {
  const { userKey, lastOnline } = req.body;

  if (!userKey || !lastOnline) {
    return res.status(400).json({ error: "Missing userKey or lastOnline" });
  }

  try {
    const update = {
      lastOnline: new Date(lastOnline)
    };

    await User.findOneAndUpdate(
      { userKey },
      { $set: update },
      { upsert: true, new: true }
    );

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Status update error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getStatusSummary = async (req, res) => {
  try {
    const users = await User.find({}, { lastOnline: 1, userKey: 1 });

    const currentTime = Date.now();
    let online = 0;
    let offline = 0;

    users.forEach(user => {
      const lastOnlineTime = new Date(user.lastOnline).getTime();
      const isOnline = currentTime - lastOnlineTime <= 15000;

      if (isOnline) online++;
      else offline++;
    });

    res.json({ online, offline });
  } catch (err) {
    console.error("Error getting status summary:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const ONLINE_THRESHOLD_MS = 15000;

exports.getAllUserStatuses = async (req, res) => {
  try {
    const users = await User.find({}, { userKey: 1, lastOnline: 1 });

    const currentTime = Date.now();

    const result = users.map(user => {
      const lastOnlineTime = new Date(user.lastOnline).getTime();
      const isOnline = currentTime - lastOnlineTime <= ONLINE_THRESHOLD_MS;

      return {
        userKey: user.userKey,
        lastOnline: user.lastOnline,
        isOnline: isOnline
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user statuses:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
