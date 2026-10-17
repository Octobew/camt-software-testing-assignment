import express, { Request, Response } from 'express'
import cors from 'cors'
import locationRoute from "./routes/LocationRoute";
import authRoutes from './routes/AuthRoutes'
import ConstituencyRoutes from './routes/ConstituencyRoutes'
import voterouter from './routes/VoteRoutes'
import partyRoutes from './routes/PartyRoutes';
import candidateRoutes from "./routes/CandidateRoutes";
import uploadfile from './routes/UploadFileRoutes';


const app = express()
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(cors())



app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! เจอกันได้จ้า')
})

app.use("/locations", locationRoute);
app.use('/vote', voterouter)
app.use('/auth', authRoutes)
app.use('/constituencies', ConstituencyRoutes) // cre-->constituencies
app.use('/party', partyRoutes);
app.use("/candidates", candidateRoutes);
app.use('/uploadfile', uploadfile);




app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})