"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Message_1;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let Message = Message_1 = class Message {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('simple-json', { default: {} }),
    __metadata("design:type", Object)
], Message.prototype, "body", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "seen", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "deletedBySender", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "deletedByRecepient", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, users => users.messageSender),
    __metadata("design:type", Users_1.Users)
], Message.prototype, "sender", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, users => users.messageRecepient),
    __metadata("design:type", Users_1.Users)
], Message.prototype, "recepient", void 0);
__decorate([
    typeorm_1.OneToOne(() => Message_1, message => message.to),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Message)
], Message.prototype, "ref", void 0);
__decorate([
    typeorm_1.OneToOne(() => Message_1, message => message.ref),
    __metadata("design:type", Message)
], Message.prototype, "to", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Message.prototype, "updatedAt", void 0);
Message = Message_1 = __decorate([
    typeorm_1.Entity()
], Message);
exports.Message = Message;
//# sourceMappingURL=Message.js.map