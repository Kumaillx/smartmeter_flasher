import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  const command = new ListObjectsV2Command({
    Bucket: "custom-meter-firmware-updates",
    Prefix: "single_slot/",
  });

  const response = await s3.send(command);

  const versions =
    response.Contents?.map((obj) =>
      obj.Key?.replace("single_slot/firmware_", "")
        .replace(".bin", "")
    ).filter(Boolean) || [];

  return Response.json({
    versions: versions.sort().reverse(),
  });
}
