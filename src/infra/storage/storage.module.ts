import { Module } from "@nestjs/common";
import { Uploader } from "@/domain/marketplace/application/storage/uploader";
import { R2Storage } from "./r2-storage";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    }
  ],
  exports: [Uploader]
})

export class StorageModule { }