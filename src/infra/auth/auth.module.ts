import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env.service";
import { JwtStrategy } from "./jwt.estrategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
  imports: [
    PassportModule, 
    EnvModule,
    // com o JwtModule registerAsync eu posso injetar o modulo do ENV para ser usado dentro da func
    // inversão de dependencia dentro do modulo
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get("JWT_PRIVATE_KEY")
        const publicKey = env.get("JWT_PUBLIC_KEY")

        return {
          //algoritimo 
          signOptions: {algorithm: "RS256"},
          privateKey: Buffer.from(privateKey, "base64"),
          publicKey: Buffer.from(publicKey, "base64"),
        }
      }
  }),
],
providers: [
  JwtStrategy,
  EnvService,
  // quando eu chamar o APP_GUARD eu tenho que chamar o JwtAuthGuard
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }
]
})
export class AuthModule {}