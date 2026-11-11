// server/middlewares/validateUploads.js
const MAX_PDFS = 2;

export const validateUploads = (req, res, next) => {
  const files = req.files || [];
  if (files.length === 0) return next();

  const pdfs = files.filter(
    (f) => f.mimetype === "application/pdf" || f.originalname.toLowerCase().endsWith(".pdf")
  );

  if (pdfs.length > MAX_PDFS) {
    return res.status(400).json({
      message: `A listing can include at most ${MAX_PDFS} PDF files.`,
    });
  }

  next();
};