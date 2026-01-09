import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const bucketName = process.env.AWS_S3_BUCKET || "hodlearn-assets";
const cdnDomain = process.env.AWS_CLOUDFRONT_DOMAIN;

export type ImageCategory = "advertisers" | "social-media" | "content" | "store" | "misc";

function generateUniqueKey(category: ImageCategory, originalFilename: string): string {
  const timestamp = Date.now();
  const randomId = crypto.randomBytes(8).toString("hex");
  const extension = originalFilename.split(".").pop()?.toLowerCase() || "jpg";
  const sanitizedName = originalFilename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .substring(0, 50);
  
  return `${category}/${timestamp}-${randomId}-${sanitizedName}.${extension}`;
}

export async function generatePresignedUploadUrl(
  category: ImageCategory,
  filename: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const key = generateUniqueKey(category, filename);
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });
  
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
  
  const publicUrl = cdnDomain 
    ? `https://${cdnDomain}/${key}`
    : `https://${bucketName}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
  
  return { uploadUrl, key, publicUrl };
}

export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  
  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteS3Object(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  
  await s3Client.send(command);
}

export function getPublicUrl(key: string): string {
  return cdnDomain 
    ? `https://${cdnDomain}/${key}`
    : `https://${bucketName}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

export function isS3Configured(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && 
            process.env.AWS_SECRET_ACCESS_KEY && 
            process.env.AWS_S3_BUCKET);
}

export { s3Client, bucketName };
