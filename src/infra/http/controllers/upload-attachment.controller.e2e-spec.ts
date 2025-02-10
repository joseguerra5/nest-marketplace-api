import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { SellerFactory } from 'test/factories/make-seller'


describe('Upload attachments (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    sellerFactory = moduleRef.get(SellerFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[POST] /attachments', async () => {
    const user = await sellerFactory.makePrismaSeller({
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })


    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach("file", "./test/e2e/test.jpeg")

      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual({
        attachmentId: expect.any(String),
      })
  })
})
