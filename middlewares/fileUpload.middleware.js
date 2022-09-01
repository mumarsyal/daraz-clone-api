const multer = require('multer');

const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpg': 'jpg',
	'image/jpeg': 'jpeg',
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const isValidFile = MIME_TYPE_MAP[file.mimetype];
		const error = isValidFile ? null : new Error('Invalid mime type');
		cb(error, process.env.IMAGE_UPLOADS_FOLDER);
	},
	filename: (req, file, cb) => {
		const origName = file.originalname.toLowerCase().split(' ').join('-');
		const ext = MIME_TYPE_MAP[file.mimetype];
		const fileName = `${origName}-${Date.now()}.${ext}`;
		cb(null, fileName);
	},
	limits: {
		fileSize: 8000000,
	},
});

module.exports = multer({
	storage: storage,
	limits: {
		fileSize: 8000000,
	},
}).array('images', 10);
