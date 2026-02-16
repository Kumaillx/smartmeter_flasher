import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: Request,
  { params }: { params: { version: string } }
) {
  const key = `single_slot/firmware_${params.version}.bin`;

  const command = new GetObjectCommand({
    Bucket: "custom-meter-firmware-updates",
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 300,
  });

  return Response.json({
    name: "Smart Meter Firmware",
    version: params.version,
    builds: [
      {
        chipFamily: "ESP32",
        parts: [
          { path: "/bootloader.bin", offset: 4096 },
          { path: "/partitions.bin", offset: 32768 },
          { path: signedUrl, offset: 65536 },
        ],
      },
    ],
  });
}
