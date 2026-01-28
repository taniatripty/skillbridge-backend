
import app from "./app"
import { prisma } from "./lib/prisma"
const port=process.env.PORT

async function main() {
    try {
        await prisma.$connect()
        console.log('server is connected')
        app.listen(port,()=>{
            console.log(`server is running on http://localhost:${port}`)
        })
    } catch (err) {
        console.log('error is occured',err)
        prisma.$disconnect()
        process.exit(1)
        
    }
}
main()