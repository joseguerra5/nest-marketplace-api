import { Uploader, UploadParams } from "@/domain/marketplace/application/storage/uploader";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { EnvService } from "../env/env.service";
import { randomUUID } from "crypto";


@Injectable()
export class R2Storage implements Uploader {
  //conexão com o cloud flare
  private client: S3Client
  constructor(
    private envService: EnvService
  ) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')
    const accessKeyId = envService.get('AWS_ACCESS_KEY_ID')
    const secretAccessKey = envService.get('AWS_SECRET_ACCESS_KEY')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }
  async upload({
    body,
    fileName,
    fileType
  }: UploadParams): Promise<{ url: string; }> {
    const uploadId = randomUUID()

    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
  
}
  