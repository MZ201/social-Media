"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_session_1 = __importDefault(require("cookie-session"));
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
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
const app = express_1.default();
typeorm_1.createConnection().then(() => {
    app.use(express_1.default.json());
    app.set('trust proxy', 1);
    app.use(cors_1.default(corsOptions));
    app.use(morgan_1.default('dev'));
    app.use(cookie_session_1.default({
        secure: false,
        signed: false,
        name: "session",
    }));
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
}).catch(error => console.log("TypeORM connection error: ", error));
exports.default = app;
//# sourceMappingURL=httpServer.js.map