import multer from "multer";

const getFormattedDate = function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public");
    },
    filename: function (req, file, cb) {
        cb(null, getFormattedDate() + "-" + file.originalname);
    }
});

export const upload = multer({ storage });
