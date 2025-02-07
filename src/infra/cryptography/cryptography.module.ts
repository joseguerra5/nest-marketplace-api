import { Encrypter } from "@/domain/marketplace/application/cryptography/encrypter";
import { Module } from "@nestjs/common";
import { JwtEncrypter } from "./jwt-encrypter";
import { BcryptHasher } from "./bcrypt-hasher";
import { HashGenerator } from "@/domain/marketplace/application/cryptography/hash-generator";
import { HashComparer } from "@/domain/marketplace/application/cryptography/hash-comparer";

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator]
})

export class CryptographyModule { }