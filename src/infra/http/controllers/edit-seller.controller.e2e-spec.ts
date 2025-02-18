import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { SellerFactory } from 'test/factories/make-seller'


describe('Change seller status (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sellerFactory: SellerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, SellerFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    sellerFactory = moduleRef.get(SellerFactory)
    sellerFactory = moduleRef.get(SellerFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[PUT] /sellers', async () => {
    const user = await sellerFactory.makePrismaSeller({
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/sellers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: "test",
        name: "test",
        password: "123456",
        newPassword: "test",
        phone: "12312312312",
      })

    expect(response.statusCode).toBe(200)

    const sellerOnDatabase = await prisma.user.findFirst({
      where: {
        id: user.id.toString()
      },
    })

    expect(sellerOnDatabase).toBeTruthy()

    expect(sellerOnDatabase?.name).toEqual("test")
  })
})
