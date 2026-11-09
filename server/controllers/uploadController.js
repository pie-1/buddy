// server/controllers/uploadController.js
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = req.files.map((f) => f.path);
    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};