import express ,{json} from 'express';
import indexRoutes from './routes/index.routes.js';
import {PORT,HOST} from './config/configEnv.js';
import {connectDB} from './config/configDB.js'

async function setUpServer() {
    try {
        const app=express();
        app.use(json());
        app.use('/api',indexRoutes);
        app.listen(PORT,()=>{
            console.log(`aplicacion escuchando en http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

async function setUpApi() {
    try {
        await connectDB();
        await setUpServer();   
    } catch (error) {
        console.error(error);
    }
}

setUpApi()
    .then(()=> console.log('API iniciada correctamente'))
    .catch((error)=>{
        console.log(error);
    })