import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "./jwt.estrategy";
// crio um decorator do nest JS para autenticar se o id do usuario que vem da requisição realmente é real e eestá assinado pela chave privada
export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
  // prega a esquisiçãp e da requisição pega o UserPau;pad
  const request = context.switchToHttp().getRequest()

  return request.user as UserPayload
})