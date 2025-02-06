import { HashComparer } from "@/domain/marketplace/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/marketplace/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {
  async compare(plain: string, hashed: string): Promise<boolean> {
    return plain.concat("-hashed") === hashed;
  }
  async hash(plain: string): Promise<string> {
    return plain.concat("-hashed")
  }

}