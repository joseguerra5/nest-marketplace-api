import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { CategoryFactory } from 'test/factories/make-category'
import { ProductFactory } from 'test/factories/make-product'
import { ProductAttachmentFactory } from 'test/factories/make-product-attachment'
import { SellerFactory } from 'test/factories/make-seller'


describe('Change product status (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sellerFactory: SellerFactory
  let productFactory: ProductFactory
  let attachmentFactory: AttachmentFactory
  let productAttachmentFactory: ProductAttachmentFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, ProductFactory, CategoryFactory, AttachmentFactory, ProductAttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    sellerFactory = moduleRef.get(SellerFactory)
    productFactory = moduleRef.get(ProductFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    productAttachmentFactory = moduleRef.get(ProductAttachmentFactory)
    categoryFactory = moduleRef.get(CategoryFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[PUT] /products/:productId', async () => {
    const user = await sellerFactory.makePrismaSeller({
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const product = await productFactory.makePrismaProduct({
      sellerId: user.id,
      categoryId: category.id
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    await productAttachmentFactory.makePrismaProductAttachment({
      attachmentId: attachment1.id,
      productId: product.id,
    })

    await productAttachmentFactory.makePrismaProductAttachment({
      attachmentId: attachment2.id,
      productId: product.id,
    })

    const attachment3 = await attachmentFactory.makePrismaAttachment()


    const response = await request(app.getHttpServer())
      .put(`/products/${product.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        categoryId: category.id.toString(),
        description: "test",
        priceInCents: 123123,
        productId: product.id.toString(),
        sellerId: user.id.toString(),
        title: "test",
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      })


    expect(response.statusCode).toBe(200)

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        id: product.id.toString()
      },
    })

    expect(productOnDatabase).toBeTruthy()

    expect(productOnDatabase?.description).toEqual("test")
  })
})
