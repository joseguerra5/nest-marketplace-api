import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { AvatarAttachmentFactory } from 'test/factories/make-avatar-attachment'
import { CategoryFactory } from 'test/factories/make-category'
import { ProductFactory } from 'test/factories/make-product'
import { SellerFactory } from 'test/factories/make-seller'


describe('Get a product (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory
  let productFactory: ProductFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, ProductFactory, CategoryFactory, AvatarAttachmentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    sellerFactory = moduleRef.get(SellerFactory)
    productFactory = moduleRef.get(ProductFactory)
    categoryFactory = moduleRef.get(CategoryFactory)

    await app.init()
  })
  test('[GET] /products', async () => {
    const user = await sellerFactory.makePrismaSeller()


    const category = await categoryFactory.makePrismaCategory()

    await productFactory.makePrismaProduct({
      sellerId: user.id,
      categoryId: category.id
    })

    await productFactory.makePrismaProduct({
      sellerId: user.id,
      categoryId: category.id
    })


    const response = await request(app.getHttpServer())
      .get(`/products`)
      .send()

    expect(response.statusCode).toBe(200)


    expect(response.body.product).toHaveLength(2)
  })
})
