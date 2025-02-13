import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ProductFactory } from 'test/factories/make-product'
import { SellerFactory } from 'test/factories/make-seller'


describe('Change product status (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sellerFactory: SellerFactory
  let productFactory: ProductFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, ProductFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    sellerFactory = moduleRef.get(SellerFactory)
    productFactory = moduleRef.get(ProductFactory)
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


    const response = await request(app.getHttpServer())
      .put(`/products/${product.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentsIds: ["1", "2"],
        categoryId: category.id.toString(),
        description: "test",
        priceInCents: 123123,
        productId: product.id.toString(),
        sellerId: user.id.toString(),
        title: "test",
      })

    console.log(response.body.errors.details)

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
