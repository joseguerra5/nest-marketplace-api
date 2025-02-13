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
import { CountSellerAvailableProductsUseCase } from "@/domain/marketplace/application/use-cases/count-seller-available-products";
import { GetCountAmountAvailableProductsController } from "./controllers/count-seller-available-products.cotroller";
import { CountSellerSoldProductsUseCase } from "@/domain/marketplace/application/use-cases/count-seller-sold-products";
import { GetCountAmountSoldProductsController } from "./controllers/count-seller-sold-products.controller";
import { GetCountSellersViewsPerDayController } from "./controllers/count-seller-views-per-day.controller";
import { CountSellerViewsPerDayUseCase } from "@/domain/marketplace/application/use-cases/count-seller-views-per-day";
import { CountSellerViewsUseCase } from "@/domain/marketplace/application/use-cases/count-seller-views";
import { GetCountSellersViewsController } from "./controllers/count-seller-views.controller";
import { GetCountProductViews7daysController } from "./controllers/count-views-product-7-days.controller";
import { CountViewsProduct7daysUseCase } from "@/domain/marketplace/application/use-cases/count-views-product-7-days";
import { EditProductController } from "./controllers/edit-product.controller";
import { EditProductUseCase } from "@/domain/marketplace/application/use-cases/edit-product";

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
    GetCountAmountAvailableProductsController,
    GetCountAmountSoldProductsController,
    GetCountSellersViewsPerDayController,
    GetCountSellersViewsController,
    GetCountProductViews7daysController,
    EditProductController,
  ],
  providers: [
    RegisterSellerUseCase,
    CreateProductUseCase,
    AuthenticateSellerUseCase,
    ChangeProductStatusBySellerIdUseCase,
    UploadAndCreateAttachmentUseCase,
    RegisterViewerUseCase,
    GetProductUseCase,
    CountSellerAvailableProductsUseCase,
    CountSellerSoldProductsUseCase,
    CountSellerViewsPerDayUseCase,
    CountSellerViewsUseCase,
    CountViewsProduct7daysUseCase,
    EditProductUseCase
  ],
})

export class HttpModule { }