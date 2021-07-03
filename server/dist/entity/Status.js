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
const Group_1 = require("./Group");
const Page_1 = require("./Page");
const Users_1 = require("./Users");
let Status = class Status {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Status.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('simple-json', { default: {} }),
    __metadata("design:type", Object)
], Status.prototype, "body", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, users => users.statusCreator),
    __metadata("design:type", Users_1.Users)
], Status.prototype, "creator", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users, users => users.statusVisitor),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Status.prototype, "visitor", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Page_1.Page, page => page.statusRoom),
    __metadata("design:type", Page_1.Page)
], Status.prototype, "pageRoom", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Group_1.Group, group => group.statusRoom),
    __metadata("design:type", Group_1.Group)
], Status.prototype, "groupRoom", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Status.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Status.prototype, "updatedAt", void 0);
Status = __decorate([
    typeorm_1.Entity()
], Status);
exports.Status = Status;
//# sourceMappingURL=Status.js.map