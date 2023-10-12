const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const XLSX = require("xlsx");

const app = express();
// app.use(express.urlencoded({ extended: false, limit: "10mb" }));
// app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
// app.use((req, res, next) => {
// 	res.setHeader("Content-Type", "text/html; charset=utf-8");
// 	next();
// });

const port = 8001;

const db = "mongodb://127.0.0.1/med_reserved-check"; //change!!!

// Connect to Mongo with Mongoose
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Mongo connected"))
	.catch((err) => console.log(err));

const mongo = mongoose.connection;

const updateCollections = async (data) => {
	let tmp = data.map((item) => {
		let reservevisits = {
			name: "",
			family: "",
			pesonal_number: "",
			civilian_number: 0,
			present: false,
			todayPresent: false,
			dailSent: false,
			shamapOpen: false,
			subject: "",
			details: "",
			unit: "",
		};
		reservevisits.name = item.שם;
		reservevisits.family = item["שם משפחה"];
		reservevisits.pesonal_number = item["תעודת זהות"];
		reservevisits.civilian_number = item["מספר אישי"];
		reservevisits.present = item["התייצב"];
		reservevisits.todayPresent = item["התייצב היום"];
		reservevisits.dailSent = item["נשלח חייגן"];
		reservevisits.shamapOpen = item['נפתח שמ"פ'];
		reservevisits.subject = item["מקצוע"];
		reservevisits.details = item["הערות"];
		reservevisits.unit = item["יחידה"];
		return reservevisits;
	});
	console.log(tmp);
	const collection = mongo.collection("test");
	await collection.insertMany(tmp);
	// await collection.insertMany()
};

// Set up Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Define an endpoint that accepts XLS files and converts them to JSON
app.post("/upload", upload.single("xlsFile"), (req, res) => {
	const filePath = req.file.path;
	const workbook = XLSX.readFile(filePath);
	const sheetName = workbook.SheetNames[0];
	const sheet = workbook.Sheets[sheetName];
	const jsonData = XLSX.utils.sheet_to_json(sheet);
	updateCollections(jsonData);
	// console.log(jsonData[3]["שם משפחה"]);
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
