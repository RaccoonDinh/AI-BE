import express, { Express } from "express";
import { RegisterRoutes } from "./routes";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import initSwagger from "./configs/swagger";
import initMongoDB from "./configs/mongodb";
import { errorHandler } from "./utils/error-handler";
import cors from "cors";
import initCloudinary from "./configs/cloudinary";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const allowedOrigins: string[] = ['https://aitools.vietnamstartup.io/', 'http://localhost:3000']; // Thay thế bằng tên miền frontend thực tế của bạn và thêm bất kỳ tên miền khác bạn muốn cho phép.
const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (allowedOrigins.includes(origin!) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
// app.use(passport.initialize());
// app.use(passport.session());

initMongoDB()
  .then(() => {
    console.log("⚡[Server]: Connect to database success");

    initSwagger(app);

    initCloudinary();

    RegisterRoutes(app);

    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`⚡[Server]: Server is running at https://localhost:${port}`);
      console.log(
        `⚡️[Swagger]: Swagger is running at http://localhost:${port}/docs`
      );
    });
  })
  .catch((error) => {
    console.log("⚠️[Server]: Cannot connect to database ");
    console.log(error);
  });
