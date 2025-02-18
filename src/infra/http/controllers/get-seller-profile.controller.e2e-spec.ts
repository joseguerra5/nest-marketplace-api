import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { AvatarAttachmentFactory } from 'test/factories/make-avatar-attachment'
import { SellerFactory } from 'test/factories/make-seller'


describe('Get a product (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory
  let attachmentFactory: AttachmentFactory
  let avatarFactory: AvatarAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, AvatarAttachmentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    sellerFactory = moduleRef.get(SellerFactory)
    avatarFactory = moduleRef.get(AvatarAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[GET] /sellers/me', async () => {
    const user = await sellerFactory.makePrismaSeller({
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const attachment = await attachmentFactory.makePrismaAttachment()
    await avatarFactory.makePrismaAvatarAttachment({
      sellerId: user.id,
      attachmentId: attachment.id
    })

    const response = await request(app.getHttpServer())
      .get(`/sellers/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)


    expect(response.body).toEqual({
      seller: expect.objectContaining({
        id: user.id.toString()
      }),
    })
  })
})
