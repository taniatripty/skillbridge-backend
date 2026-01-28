import express from'express'
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
const app=express()
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json())
app.use(cors({
    origin:process.env.APP_URL,
    credentials:true
    
}))

app.get('/',(req,res)=>{
res.send('SkillBridge Backend')
})
export default app;