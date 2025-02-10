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
import { SellerFactory } from 'test/factories/make-seller'


describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sellerFactory: SellerFactory
  let categoryFactory: CategoryFactory
  let attachmentFactory: AttachmentFactory
  let productFactory: ProductFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, AttachmentFactory, CategoryFactory, ProductFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    sellerFactory = moduleRef.get(SellerFactory)
    productFactory = moduleRef.get(ProductFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[POST] /products', async () => {
    const user = await sellerFactory.makePrismaSeller({
      password: await hash('123456', 8),
    })
    const user2 = await sellerFactory.makePrismaSeller()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const category = await categoryFactory.makePrismaCategory()

    const product = await productFactory.makePrismaProduct({
      sellerId: user2.id,
      categoryId: category.id
    })


    const response = await request(app.getHttpServer())
      .post(`/products/${product.id.toString()}/views`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
          categoryId: category.id.toString(),
          title: "test",
          description: "description test",
          priceInCents: 123123123,
          attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const viewOnDatabase = await prisma.view.findFirst({
      where: {
        viewerId: user.id.toString()
      },
    })

    expect(viewOnDatabase).toBeTruthy()
  })
})
