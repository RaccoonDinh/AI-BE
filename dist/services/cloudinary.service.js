"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
// const cloudinary = require("cloudinary").v2;
const cloudinary_1 = require("cloudinary");
const toStream = require("buffer-to-stream");
class CloudinaryService {
    static upload(file, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const upload = cloudinary_1.v2.uploader.upload_stream({
                    folder: folderName,
                }, (error, result) => {
                    if (error)
                        return reject(error);
                    if (result)
                        resolve(result);
                });
                toStream(file.buffer).pipe(upload);
            });
        });
    }
    static deleteImage(pulbicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield cloudinary_1.v2.uploader.destroy(pulbicId);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    static getImageUrl(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (publicId) {
                const url = cloudinary_1.v2.url(publicId);
                return url;
            }
            return "https://res.cloudinary.com/cake-shop/image/upload/v1662910949/default-image_n5nxby.jpg";
        });
    }
}
exports.CloudinaryService = CloudinaryService;
