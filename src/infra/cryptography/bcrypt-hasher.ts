import { HashComparer } from "@/domain/marketplace/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/marketplace/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcryptjs";


@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  hash(plain: string): Promise<string> {
    return hash(plain, 8)
  }
  compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed)
  }
}