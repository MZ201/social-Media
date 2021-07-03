"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userRoutes_1 = __importDefault(require("./router/userRoutes"));
const postRoutes_1 = __importDefault(require("./router/postRoutes"));
const commentRoutes_1 = __importDefault(require("./router/commentRoutes"));
const reactionRoutes_1 = __importDefault(require("./router/reactionRoutes"));
const groupRoutes_1 = __importDefault(require("./router/groupRoutes"));
const statusRoutes_1 = __importDefault(require("./router/statusRoutes"));
const messageRoutes_1 = __importDefault(require("./router/messageRoutes"));
const pageRoutes_1 = __importDefault(require("./router/pageRoutes"));
const interactRoutes_1 = __importDefault(require("./router/interactRoutes"));
const error_1 = require("./middleware/error");
const notFound_1 = require("./error/notFound");
const Status_1 = require("./entity/Status");
dotenv_1.default.config();
const corsOptions = {
    origin: 'http://localhost:3000',
};
typeorm_1.createConnection().then(() => {
    const PORT = 4000;
    const app = express_1.default();
    app.use(express_1.default.json());
    app.use(morgan_1.default('dev'));
    app.use(cookie_session_1.default({
        name: 'auth',
        secure: false,
        signed: false
    }));
    const httpServer = http_1.default.createServer(app);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["*"],
            credentials: true
        }
    });
    io.on('connection', () => {
        console.log("connection has been estaplish ");
    });
    app.use('/api/user', userRoutes_1.default);
    app.use('/api/post', postRoutes_1.default);
    app.use('/api/comment', commentRoutes_1.default);
    app.use('/api/reaction', reactionRoutes_1.default);
    app.use('/api/group', groupRoutes_1.default);
    app.use('/api/status', statusRoutes_1.default);
    app.use('/api/message', messageRoutes_1.default);
    app.use('/api/page', pageRoutes_1.default);
    app.use('/api/interact', interactRoutes_1.default);
    app.all('*', express_async_handler_1.default(() => {
        throw new notFound_1.NotFoundError();
    }));
    app.use(error_1.errorHandler);
    httpServer.listen(4001, () => {
        console.log(`websocket listen on port  ${PORT}`);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection()
                .createQueryBuilder()
                .delete()
                .from(Status_1.Status)
                .where('id = 16')
                .execute();
        }), 5000);
    });
    app.listen(PORT, () => {
        console.log(`server listen on port  ${PORT}`);
    });
}).catch(error => console.log("TypeORM connection error: ", error));
//# sourceMappingURL=server.js.map