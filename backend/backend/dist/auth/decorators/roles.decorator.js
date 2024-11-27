"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
var Role;
(function (Role) {
    Role["Student"] = "student";
    Role["Instructor"] = "instructor";
    Role["Admin"] = "admin";
})(Role || (exports.Role = Role = {}));
//# sourceMappingURL=roles.decorator.js.map