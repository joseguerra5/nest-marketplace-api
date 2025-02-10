import { SetMetadata } from "@nestjs/common";

// faço um decorator para mostrar as rotas que são publicas, precisando chamar apenas o decorator @Public()
export const IS_PUBLIC_KEY = "isPublic"
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)