import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.router";
import accountRouter from "./routes/account.router";
import eventRouter from "./routes/event.router";

import userRouter from "./routes/user.router";
import rewardsRouter from "./routes/rewards.router";
import "./scripts/pointsExpiryScheduler";

import eventCategoryRouter from "./routes/event-category.routes";
import transactionDummyRouter from "./routes/transaction-dummy.router";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/auth", authRouter);
app.use("/account", accountRouter);
app.use("/events", eventRouter);
app.use("/user", userRouter);
app.use("/rewards", rewardsRouter);
app.use("/event-categories", eventCategoryRouter);
app.use("/transaction-dummy", transactionDummyRouter);

// middleware error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

export default app;
