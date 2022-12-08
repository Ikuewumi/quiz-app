"use strict";
exports.__esModule = true;
exports.ZodTypes = void 0;
var zod_1 = require("zod");
var ZodTypes;
(function (ZodTypes) {
    ZodTypes.zUserMetadata = zod_1.z.object({
        name: zod_1.z.string().min(1),
        description: zod_1.z.string().min(0),
        image: zod_1.z.string()
    });
})(ZodTypes = exports.ZodTypes || (exports.ZodTypes = {}));
