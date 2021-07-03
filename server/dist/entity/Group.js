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
const typeorm_1 = require("typeorm");
const Post_1 = require("./Post");
const Status_1 = require("./Status");
const Users_1 = require("./Users");
let Group = class Group {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Group.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Group.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: 'default.png' }),
    __metadata("design:type", String)
], Group.prototype, "image", void 0);
__decorate([
    typeorm_1.Column({ default: 'back.png' }),
    __metadata("design:type", String)
], Group.prototype, "backgroundImage", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users, user => user.groupMember),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Group.prototype, "admin", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users, user => user.groupMember),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Group.prototype, "member", void 0);
__decorate([
    typeorm_1.OneToMany(() => Post_1.Post, post => post.groupRoom),
    __metadata("design:type", Post_1.Post)
], Group.prototype, "room", void 0);
__decorate([
    typeorm_1.OneToMany(() => Status_1.Status, status => status.groupRoom),
    __metadata("design:type", Status_1.Status)
], Group.prototype, "statusRoom", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Group.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Group.prototype, "updatedAt", void 0);
Group = __decorate([
    typeorm_1.Entity()
], Group);
exports.Group = Group;
//# sourceMappingURL=Group.js.map