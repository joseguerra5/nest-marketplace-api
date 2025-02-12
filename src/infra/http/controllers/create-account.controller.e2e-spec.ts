import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe("Create account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)
    await app.init();
  });
  test("[POST] /sellers", async () => {
    const response = await request(app.getHttpServer()).post("/sellers").send({
      name: "Jhon Doe",
      email: "jhondoe@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
      phone: "12345678",
      avatarId: null
    })
    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "jhondoe@example.com"
      }
    })

    expect(userOnDatabase).toBeTruthy()
  })
})