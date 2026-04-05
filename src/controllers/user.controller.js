import User from "../models/user.model.js";


export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // validate role
    const allowedRoles = ["viewer", "analyst", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    //prevent admin deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({
      message: "User deactivated (soft deleted)",
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting user",
    });
  }
};
