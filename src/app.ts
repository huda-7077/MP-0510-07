import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.router";
import accountRouter from "./routes/account.router";
import "./scripts/pointsExpiryScheduler";
import eventRouter from "./routes/event.router";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/auth", authRouter);
app.use("/account", accountRouter);
app.use("/events", eventRouter)

// middleware error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

export default app;
