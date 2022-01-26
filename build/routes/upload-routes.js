"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
var express_1 = __importDefault(require("express"));
var upload_image_1 = __importDefault(require("../controllers/upload/upload-image"));
var router = express_1.default.Router();
exports.uploadRoutes = router;
router.post('/api/upload/image', upload_image_1.default);
