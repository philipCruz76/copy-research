import { S3Client } from "@aws-sdk/client-s3";

const s3Singleton = () => {
  return new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
};

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedS3: undefined | ReturnType<typeof s3Singleton>;
}

const s3 = globalThis.cachedS3 ?? s3Singleton();

export default s3;

if (process.env.NODE_ENV === "development") {
  globalThis.cachedS3 = s3;
}
