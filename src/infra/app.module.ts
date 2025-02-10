import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { HttpModule } from './http/http.module';
import { AuthModule } from './auth/auth.module';


// module reune tudo e é uma classe vazia  
// providers são dependencias que o controller pode ter, caso de uso, serviço, repositorio...
// tudo que não é um controller deve ser um porovider
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    EnvModule,
    HttpModule,
    AuthModule
  ],
})
export class AppModule { }
