export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
export declare enum Role {
    Student = "student",
    Instructor = "instructor",
    Admin = "admin"
}
