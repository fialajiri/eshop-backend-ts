import { Request, Response, NextFunction } from "express";
import { v1 as uuidv1 } from "uuid";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION
});

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  const productName = req.body.name;

  const key = `${productName}/${uuidv1()}.jpeg`;

  const url = await s3.getSignedUrl("putObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    ContentType: "image/jpeg",
    Key: key,
  });

  res.send({key, url})
};

export default uploadImage;
