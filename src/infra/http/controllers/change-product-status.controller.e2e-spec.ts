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


describe('Create question (E2E)', () => {
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
  test('[PATCH] /products/:productId/:status', async () => {
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
      .patch(`/products/${product.id.toString()}/sold`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    
    expect(response.statusCode).toBe(204)

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        id: product.id.toString()
      },
    })

    expect(productOnDatabase).toBeTruthy()

    expect(productOnDatabase?.status).toEqual("SOLD")
  })
})
