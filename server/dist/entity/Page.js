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
const Comment_1 = require("./Comment");
const Post_1 = require("./Post");
const Status_1 = require("./Status");
const Users_1 = require("./Users");
let Page = class Page {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Page.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Page.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: "default.png" }),
    __metadata("design:type", String)
], Page.prototype, "image", void 0);
__decorate([
    typeorm_1.Column({ default: "defaultBack.png" }),
    __metadata("design:type", String)
], Page.prototype, "backgroundImage", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users, user => user.page),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Page.prototype, "followers", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, users => users.pageCreator),
    __metadata("design:type", Users_1.Users)
], Page.prototype, "creator", void 0);
__decorate([
    typeorm_1.OneToMany(() => Post_1.Post, (post) => post.pageRoom),
    __metadata("design:type", Post_1.Post)
], Page.prototype, "room", void 0);
__decorate([
    typeorm_1.OneToMany(() => Status_1.Status, status => status.pageRoom),
    __metadata("design:type", Status_1.Status)
], Page.prototype, "statusRoom", void 0);
__decorate([
    typeorm_1.OneToMany(() => Comment_1.Comment, Comment => Comment.pageRoom),
    __metadata("design:type", Comment_1.Comment)
], Page.prototype, "commentRoom", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Page.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Page.prototype, "updatedAt", void 0);
Page = __decorate([
    typeorm_1.Entity()
], Page);
exports.Page = Page;
//# sourceMappingURL=Page.js.map