import express from'express'
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
import { categoryRoutes } from './modules/categories/categories.routes';
import { tutorController } from './modules/tutor/tutor.controller';
import { tutotRoutes } from './modules/tutor/tutor.routes';
const app=express()
app.use(cors({
    origin:process.env.APP_URL,
    credentials:true
    
}))
app.use(express.json())
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/categories", categoryRoutes);
app.use('/api/tutor',tutotRoutes)

app.get('/',(req,res)=>{
res.send('SkillBridge Backend')
})
export default app;