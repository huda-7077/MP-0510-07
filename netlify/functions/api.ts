import ServerlessHttp from "serverless-http";
import app from "../../src/app";

export const handler = ServerlessHttp(app);
