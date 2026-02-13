import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request, { params }: { params: { version: string } }){
    const version = params.version;
    const files = ["bootloader.bin", "partitions.bin", "firmware.bin"];
      const signedUrls = await Promise.all(
    files.map(async (file) => {
      const command = new GetObjectCommand({
        Bucket: "custom-meter-firmware-updates",
        Key: `factory/${version}/${file}`,
      });
      
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });

      return { file, url };
    })
  );

  return Response.json({
    name: "Smart Meter Firmware",
    version,
    builds: [
      {
        chipFamily: "ESP32",
        parts: [
          { path: signedUrls[0].url, offset: 4096 },
          { path: signedUrls[1].url, offset: 32768 },
          { path: signedUrls[2].url, offset: 65536 },
        ],
      },
    ],
  });
}