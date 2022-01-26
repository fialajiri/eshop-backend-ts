"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var validate_request_1 = require("../middlewares/validate-request");
var current_user_1 = __importDefault(require("../controllers/user/current-user"));
var delete_user_1 = __importDefault(require("../controllers/user/delete-user"));
var get_all_users_1 = __importDefault(require("../controllers/user/get-all-users"));
var update_user_profile_1 = __importDefault(require("../controllers/user/update-user-profile"));
var update_user_1 = __importDefault(require("../controllers/user/update-user"));
var get_user_details_1 = __importDefault(require("../controllers/user/get-user-details"));
var signin_1 = __importDefault(require("../controllers/user/signin"));
var signup_1 = __importDefault(require("../controllers/user/signup"));
var signout_1 = __importDefault(require("../controllers/user/signout"));
var require_auth_1 = require("../middlewares/require-auth");
var require_admin_1 = require("../middlewares/require-admin");
var router = express_1.default.Router();
exports.userRoutes = router;
router.get("/api/users/currentuser", current_user_1.default);
router.get('/api/users/getallusers', require_admin_1.requireAdmin, get_all_users_1.default);
router.get('/api/users/:userId', require_auth_1.requireAuth, get_user_details_1.default);
router.delete('/api/users/:userid', require_admin_1.requireAdmin, delete_user_1.default);
router.put('/api/users/updateprofile/:userId', require_auth_1.requireAuth, update_user_profile_1.default);
router.put('/api/user/:userId', require_admin_1.requireAdmin, update_user_1.default);
router.post("/api/users/signup", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Zadejte platný email."),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Heslo musí mít mezi 4 a 20 znaky."),
], validate_request_1.validateRequest, signup_1.default);
router.post("/api/users/signin", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Zadejte platný email."),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("Heslo nesmí být prázdné."),
], validate_request_1.validateRequest, signin_1.default);
router.post("/api/users/signout", signout_1.default);
