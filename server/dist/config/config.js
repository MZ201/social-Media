"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const conn = () => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "mohsin123",
        database: "sale",
        entities: [
            __dirname + "../entity/*.js"
        ],
        synchronize: true,
    }).then(() => __awaiter(this, void 0, void 0, function* () {
        console.log('connection is been establish');
    })).catch(error => console.log(error));
});
exports.default = conn;
//# sourceMappingURL=config.js.map