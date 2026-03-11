const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const cloudinary = require("../configs/cloudinary.config")
const { s3, PutObjectCommand, GetObjectCommand } = require("../configs/s3.config")
const crypto = require("crypto")

const uploadImageFromUrl = async () => {
    try {
        const urlImage = "https://yt3.ggpht.com/13mT1DVtpVGNVg1bFmzbW1lPcB66AcxhtjDup1b-u-ibcman7Zd-nrTuy6NKbasapM78Gclvug=s48-c-k-c0x00ffffff-no-rj"
        const folderName = 'product/shopId', fileName = "test"

        const result = await cloudinary.uploader.upload(urlImage, {
            folder: folderName,
            public_id: fileName
        })

        return result
    } catch (error) {
        console.log(error)
    }
}

const uploadImageFromLocal = async ({ path, folderName }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            folder: folderName,
            public_id: 'thumb'
        })

        return {
            image_url: result.secure_url,
            shopId: shopId
        }
    } catch (error) {

    }
}

const randomImageName = () => crypto.randomBytes(16).toString('hex')
// s3
const uploadImageFromLocalS3 = async ({ file }) => {
    try {
        const fileName = randomImageName()
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })

        const result = await s3.send(command)

        const signedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName
        })
        const url = await getSignedUrl(s3, signedUrl, {
            expiresIn: 60 * 60
        })


        return {
            image_url: url,
            shopId: shopId
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalS3
}

