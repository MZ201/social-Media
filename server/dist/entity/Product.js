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
var Category_1;
const typeorm_1 = require("typeorm");
let Category = Category_1 = class Category {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Category.prototype, "image", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Category_1, category => category.childCategories),
    __metadata("design:type", Category)
], Category.prototype, "parentCategory", void 0);
__decorate([
    typeorm_1.OneToMany(() => Category_1, category => category.parentCategory),
    __metadata("design:type", Array)
], Category.prototype, "childCategories", void 0);
Category = Category_1 = __decorate([
    typeorm_1.Entity()
], Category);
exports.Category = Category;
let Product = class Product {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", Number)
], Product.prototype, "code", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Product.prototype, "bareCode", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "Brand", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "productUnit", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "saleUnit", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Product.prototype, "cost", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Product.prototype, "qty", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "Tax", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "taxMethod", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToOne(() => Category),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Category)
], Product.prototype, "category", void 0);
Product = __decorate([
    typeorm_1.Entity()
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map