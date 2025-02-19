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


describe('Get a product (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory
  let productFactory: ProductFactory
  let categoryFactory: CategoryFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, ProductFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    sellerFactory = moduleRef.get(SellerFactory)
    productFactory = moduleRef.get(ProductFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[GET] /products/me', async () => {
    const user = await sellerFactory.makePrismaSeller({
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const product1 = await productFactory.makePrismaProduct({
      sellerId: user.id,
      categoryId: category.id
    })

    const product2 = await productFactory.makePrismaProduct({
      sellerId: user.id,
      categoryId: category.id
    })

    console.log(user.id, product1, product2)

    const response = await request(app.getHttpServer())
      .get(`/products/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body, await prisma.product.findMany({
      where:
        {
          sellerId: user.id.toString()
        }
    }))

    expect(response.statusCode).toBe(200)


    expect(response.body).toEqual({
      product: expect.objectContaining({
      }),
    })
  })
})
