import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import router from './routers/router';
import post from './routers/post';
import passport from './validation/passport';
import privacy from './routers/privacy';

const app = express();
const port = process.env.PORT as string;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use('/api', router, post, privacy);

const runServer = (port: number, server: http.Server) => {
    server.listen(port, () => {
        console.log(`Serviço no AR! PORT = ${process.env.PORT}`);
    });
}

const regularServer = http.createServer(app);
runServer(parseInt(port), regularServer);