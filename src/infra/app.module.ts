import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env';


// module reune tudo e é uma classe vazia  
// providers são dependencias que o controller pode ter, caso de uso, serviço, repositorio...
// tudo que não é um controller deve ser um porovider
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env)  => envSchema.parse(env),
      isGlobal: true
    })
  ],
})
export class AppModule {}
