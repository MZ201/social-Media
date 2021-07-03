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
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const httpServer_1 = __importDefault(require("./httpServer"));
const PORT = 4000;
const httpServer = http_1.default.createServer(httpServer_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["POST"]
    }
});
exports.io = io;
httpServer_1.default.set('io', io);
io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
    const client = socket.handshake.auth.client;
    socket.mySelf = client;
    next();
}));
io.on('connection', (socket) => {
    console.log(socket.mySelf);
    if (socket.mySelf !== undefined) {
        socket.join(`${socket.mySelf.id}`);
        socket.to([...socket.mySelf.friends.map(fr => `${fr.id}`)]).emit('connected', 'connected');
    }
});
httpServer.listen(PORT, () => {
    console.log(`server listen on port  ${PORT}`);
});
//# sourceMappingURL=wsServer.js.map