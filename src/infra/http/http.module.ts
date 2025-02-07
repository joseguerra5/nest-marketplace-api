import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { RegisterSellerUseCase } from "@/domain/marketplace/application/use-cases/register-seller";
import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController
  ],
  providers: [
    RegisterSellerUseCase
  ],
})

export class HttpModule { }