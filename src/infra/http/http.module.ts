import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { RegisterSellerUseCase } from "@/domain/marketplace/application/use-cases/register-seller";
import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { StorageModule } from "../storage/storage.module";
import { CreateProductUseCase } from "@/domain/marketplace/application/use-cases/create-product";
import { CreateProductController } from "./controllers/create-product.controller";
import { AuthenticateAccountController } from "./controllers/authenticate.controller";
import { AuthenticateSellerUseCase } from "@/domain/marketplace/application/use-cases/authenticate-seller";
import { ChangeProductStatusBySellerIdUseCase } from "@/domain/marketplace/application/use-cases/change-product-status";
import { ChangeProductStatusController } from "./controllers/change-product-status.controller";
import { UploadAttachmentController } from "./controllers/upload-attachment.controller";
import { UploadAndCreateAttachmentUseCase } from "@/domain/marketplace/application/use-cases/upload-and-create-attachment";
import { RegisterViewController } from "./controllers/register-view-product.controller";
import { RegisterViewerUseCase } from "@/domain/marketplace/application/use-cases/register-viewer-product";
import { GetProductByIdController } from "./controllers/get-product-by-id.controller";
import { GetProductUseCase } from "@/domain/marketplace/application/use-cases/get-product-by-id";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    CreateProductController,
    AuthenticateAccountController,
    ChangeProductStatusController,
    UploadAttachmentController,
    RegisterViewController,
    GetProductByIdController,
  ],
  providers: [
    RegisterSellerUseCase,
    CreateProductUseCase,
    AuthenticateSellerUseCase,
    ChangeProductStatusBySellerIdUseCase,
    UploadAndCreateAttachmentUseCase,
    RegisterViewerUseCase,
    GetProductUseCase
  ],
})

export class HttpModule { }