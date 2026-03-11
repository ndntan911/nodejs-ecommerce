const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_BUCKET_SECRET_KEY
    }
}
const s3 = new S3Client(s3Config)

module.exports = {
    s3,
    s3Config,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
}