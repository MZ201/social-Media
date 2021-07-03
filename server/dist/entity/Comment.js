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
var Comment_1;
const typeorm_1 = require("typeorm");
const Page_1 = require("./Page");
const Post_1 = require("./Post");
const Users_1 = require("./Users");
let Comment = Comment_1 = class Comment {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Comment.prototype, "body", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, users => users.comments),
    __metadata("design:type", Users_1.Users)
], Comment.prototype, "creator", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Post_1.Post),
    __metadata("design:type", Post_1.Post)
], Comment.prototype, "post", void 0);
__decorate([
    typeorm_1.OneToMany(() => Comment_1, comment => comment.ref),
    __metadata("design:type", Array)
], Comment.prototype, "_ref", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Comment_1, comment => comment._ref),
    __metadata("design:type", Comment)
], Comment.prototype, "ref", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Page_1.Page, page => page.commentRoom),
    __metadata("design:type", Page_1.Page)
], Comment.prototype, "pageRoom", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Comment.prototype, "updatedAt", void 0);
Comment = Comment_1 = __decorate([
    typeorm_1.Entity()
], Comment);
exports.Comment = Comment;
//# sourceMappingURL=Comment.js.map