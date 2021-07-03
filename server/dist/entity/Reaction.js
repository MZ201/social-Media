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
const Users_1 = require("./Users");
let Reaction = class Reaction {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Reaction.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Reaction.prototype, "reaction", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users),
    __metadata("design:type", Users_1.Users)
], Reaction.prototype, "created", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Post_1.Post),
    __metadata("design:type", Post_1.Post)
], Reaction.prototype, "post", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Reaction.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Reaction.prototype, "updatedAt", void 0);
Reaction = __decorate([
    typeorm_1.Entity()
], Reaction);
exports.Reaction = Reaction;
let ReactionToComment = class ReactionToComment {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ReactionToComment.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ReactionToComment.prototype, "reaction", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users),
    __metadata("design:type", Users_1.Users)
], ReactionToComment.prototype, "created", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Comment_1.Comment),
    __metadata("design:type", Comment_1.Comment)
], ReactionToComment.prototype, "comment", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ReactionToComment.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ReactionToComment.prototype, "updatedAt", void 0);
ReactionToComment = __decorate([
    typeorm_1.Entity()
], ReactionToComment);
exports.ReactionToComment = ReactionToComment;
//# sourceMappingURL=Reaction.js.map