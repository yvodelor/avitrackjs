import express from "express"
import cors from "cors"
import authRouter from "./routes/authRoutes"
import router from "./routes/route"
import path from "path";

const app = express()

const allowedOrigins = process.env.FRONTEND_URLS?.split(',')

app.use(cors({
  origin:  process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "Bienvenue" })
})

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use("/api/auth", authRouter)

app.use("/api", router)


export default app