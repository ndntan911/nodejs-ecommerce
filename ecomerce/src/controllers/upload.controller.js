const { SuccessResponse } = require("../core/success.response");
const UploadService = require("../services/upload.service");

class UploadController {
    uploadImageFromUrl = async (req, res, next) => {
        new SuccessResponse({
            message: "Upload image successfully",
            metadata: await UploadService.uploadImageFromUrl(req.body),
        }).send(res);
    };

    uploadImageFromLocal = async (req, res, next) => {
        const { file } = req
        if (!file) throw new BadRequestError("No file uploaded")
        new SuccessResponse({
            message: "Upload image successfully",
            metadata: await UploadService.uploadImageFromLocal({
                path: file.path,
                folderName: 'product/shopId',
            }),
        }).send(res);
    };

    uploadImageFromLocalS3 = async (req, res, next) => {
        const { file } = req
        if (!file) throw new BadRequestError("No file uploaded")
        new SuccessResponse({
            message: "Upload image successfully",
            metadata: await UploadService.uploadImageFromLocalS3({
                file,
            }),
        }).send(res);
    };
}

module.exports = new UploadController();
