"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_1 = __importDefault(require("./configs/swagger"));
const mongodb_1 = __importDefault(require("./configs/mongodb"));
const error_handler_1 = require("./utils/error-handler");
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = __importDefault(require("./configs/cloudinary"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const allowedOrigins = ['https://aitools.vietnamstartup.io/', 'http://localhost:3000']; // Thay thế bằng tên miền frontend thực tế của bạn và thêm bất kỳ tên miền khác bạn muốn cho phép.
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// app.use(passport.initialize());
// app.use(passport.session());
(0, mongodb_1.default)()
    .then(() => {
    console.log("⚡[Server]: Connect to database success");
    (0, swagger_1.default)(app);
    (0, cloudinary_1.default)();
    (0, routes_1.RegisterRoutes)(app);
    app.use(error_handler_1.errorHandler);
    app.listen(port, () => {
        console.log(`⚡[Server]: Server is running at https://localhost:${port}`);
        console.log(`⚡️[Swagger]: Swagger is running at http://localhost:${port}/docs`);
    });
})
    .catch((error) => {
    console.log("⚠️[Server]: Cannot connect to database ");
    console.log(error);
});
