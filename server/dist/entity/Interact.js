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
const Users_1 = require("./Users");
var action;
(function (action) {
    action[action["friendship"] = 0] = "friendship";
    action[action["addToGroup"] = 1] = "addToGroup";
})(action = exports.action || (exports.action = {}));
let Interact = class Interact {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Interact.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: action,
        default: action.friendship
    }),
    __metadata("design:type", Number)
], Interact.prototype, "action", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users),
    __metadata("design:type", Users_1.Users)
], Interact.prototype, "sender", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Interact.prototype, "recepient", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Interact.prototype, "seen", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Interact.prototype, "ignore", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Interact.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Interact.prototype, "updatedAt", void 0);
Interact = __decorate([
    typeorm_1.Entity()
], Interact);
exports.Interact = Interact;
//# sourceMappingURL=Interact.js.map