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
var Users_1;
const typeorm_1 = require("typeorm");
const Message_1 = require("./Message");
const Post_1 = require("./Post");
const Page_1 = require("./Page");
const Status_1 = require("./Status");
const Comment_1 = require("./Comment");
const Group_1 = require("./Group");
let Users = Users_1 = class Users {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Users.prototype, "phoneNumber", void 0);
__decorate([
    typeorm_1.Column({ select: false }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ default: 'nice.png' }),
    __metadata("design:type", String)
], Users.prototype, "image", void 0);
__decorate([
    typeorm_1.Column({ default: 'background.png' }),
    __metadata("design:type", String)
], Users.prototype, "backgroundImage", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => Users_1, user => user.friend),
    __metadata("design:type", Array)
], Users.prototype, "friends", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1, user => user.friends),
    __metadata("design:type", Users)
], Users.prototype, "friend", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Page_1.Page, page => page.followers),
    __metadata("design:type", Array)
], Users.prototype, "page", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Group_1.Group, group => group.member),
    __metadata("design:type", Array)
], Users.prototype, "groupMember", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Group_1.Group, group => group.admin),
    __metadata("design:type", Array)
], Users.prototype, "groupadmin", void 0);
__decorate([
    typeorm_1.OneToMany(() => Post_1.Post, post => post.creator),
    __metadata("design:type", Array)
], Users.prototype, "posts", void 0);
__decorate([
    typeorm_1.OneToMany(() => Comment_1.Comment, comment => comment.creator),
    __metadata("design:type", Array)
], Users.prototype, "comments", void 0);
__decorate([
    typeorm_1.OneToMany(() => Message_1.Message, message => message.sender),
    __metadata("design:type", Message_1.Message)
], Users.prototype, "messageSender", void 0);
__decorate([
    typeorm_1.OneToMany(() => Message_1.Message, message => message.recepient),
    __metadata("design:type", Message_1.Message)
], Users.prototype, "messageRecepient", void 0);
__decorate([
    typeorm_1.OneToMany(() => Page_1.Page, page => page.creator),
    __metadata("design:type", Page_1.Page)
], Users.prototype, "pageCreator", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Post_1.Post, post => post.share),
    __metadata("design:type", Array)
], Users.prototype, "_share", void 0);
__decorate([
    typeorm_1.OneToMany(() => Status_1.Status, status => status.creator),
    __metadata("design:type", Status_1.Status)
], Users.prototype, "statusCreator", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Status_1.Status, status => status.visitor),
    __metadata("design:type", Status_1.Status)
], Users.prototype, "statusVisitor", void 0);
Users = Users_1 = __decorate([
    typeorm_1.Entity()
], Users);
exports.Users = Users;
//# sourceMappingURL=Users.js.map