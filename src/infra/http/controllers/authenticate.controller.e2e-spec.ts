import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { SellerFactory } from 'test/factories/make-seller'


describe('Create question (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    sellerFactory = moduleRef.get(SellerFactory)
    await app.init()
  })
  test('[POST] /session', async () => {
    const user = await sellerFactory.makePrismaSeller({
      password: await hash('12345678', 8),
    })


    const response = await request(app.getHttpServer())
      .post('/session')
      .send({
          email: user.email,
          password: "12345678"
      })

    expect(response.statusCode).toBe(201)
  })
})
