import { ProductStatus } from '@/domain/marketplace/enterprise/entities/product'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ProductFactory } from 'test/factories/make-product'
import { SellerFactory } from 'test/factories/make-seller'
import { ViewFactory } from 'test/factories/make-view'


describe('Get a count views per day of seller (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory
  let productFactory: ProductFactory
  let viewFactory: ViewFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, ProductFactory, CategoryFactory, ViewFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    sellerFactory = moduleRef.get(SellerFactory)
    productFactory = moduleRef.get(ProductFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    viewFactory = moduleRef.get(ViewFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  beforeEach(() => {
    vi.useFakeTimers()
  });

  afterEach(() => {
    vi.useRealTimers()
  })
  test('[GET] /products/{id}/metrics/views', async () => {
    vi.setSystemTime(new Date(2025, 0, 23, 0, 0, 0))

    const user = await sellerFactory.makePrismaSeller()
    const user2 = await sellerFactory.makePrismaSeller()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()


    const product = await productFactory.makePrismaProduct({ createdAt: new Date(2025, 0, 1), sellerId: user.id, categoryId: category.id, status: ProductStatus.sold })


    for (let i = 1; i <= 22; i++) {
      await viewFactory.makePrismaView({
        viewerId: user2.id,
        productId: product.id,
        createdAt: new Date(2025, 0, i)
      })
    }

    const response = await request(app.getHttpServer())
      .get(`/products/${product.id.toString()}/metrics/views`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.amount).toEqual(7)
  }
  )
})

