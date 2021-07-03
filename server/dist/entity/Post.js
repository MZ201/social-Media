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
const Group_1 = require("./Group");
const Page_1 = require("./Page");
const Reaction_1 = require("./Reaction");
const Users_1 = require("./Users");
let Post = class Post {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('simple-json', { default: { video: '', audio: '', content: '', img: '' } }),
    __metadata("design:type", Object)
], Post.prototype, "body", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], Post.prototype, "allow", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users),
    __metadata("design:type", Users_1.Users)
], Post.prototype, "creator", void 0);
__decorate([
    typeorm_1.OneToMany(() => Comment_1.Comment, comment => comment.post),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    typeorm_1.OneToMany(() => Reaction_1.Reaction, reaction => reaction.post),
    __metadata("design:type", Array)
], Post.prototype, "reactions", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users, users => users._share),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Post.prototype, "share", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Page_1.Page, page => page.room),
    __metadata("design:type", Page_1.Page)
], Post.prototype, "pageRoom", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Group_1.Group, group => group.room),
    __metadata("design:type", Group_1.Group)
], Post.prototype, "groupRoom", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
Post = __decorate([
    typeorm_1.Entity()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map