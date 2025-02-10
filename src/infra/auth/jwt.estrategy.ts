import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from '@/infra/env/env'
import { z } from 'zod'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

// estrategia do JWT para autenticar
// a classe por ser um provider precisa ter o injectable
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    // chama o super do PASSPORTSTRATEGY
    super({
      //define a estrategia jtw usando a requisição do front end
      // autenticação vinda do cabeçalho como BearerToken
      jwtFromRequest: ExtractJwt
      .fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKey: Buffer.from(publicKey, 'base64'),
    })
  }

  // metodo opicional que valida o sub e se o id no sub foi assinado pela private key
  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
