import express from'express'
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
import { categoryRoutes } from './modules/categories/categories.routes';

import { tutotRoutes } from './modules/tutor/tutor.routes';
import { bookingRoutes } from './modules/booking/booking.routes';
import { reviewRoutes } from './modules/review/review.routes';
const app=express()
app.use(cors({
    origin:process.env.APP_URL,
    credentials:true
    
}))
app.use(express.json())
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/categories", categoryRoutes);
app.use('/api/tutor',tutotRoutes)
app.use('/api/bookings',bookingRoutes)
app.use('/api/reviews',reviewRoutes)
app.get('/',(req,res)=>{
res.send('SkillBridge Backend')
})
export default app;