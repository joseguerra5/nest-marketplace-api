import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { View, ViewProps } from "@/domain/marketplace/enterprise/entities/view";
import { PrismaViewMapper } from "@/infra/database/prisma/mappers/prisma-view-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeView(
  overide: Partial<ViewProps> = {},
  id?: UniqueEntityId
) {
  const seller = View.create({
    productId: new UniqueEntityId(),
    viewerId: new UniqueEntityId(),
    ...overide
  }, id)
  return seller
}

@Injectable()
export class ViewFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaView(
    data: Partial<ViewProps> = {},
  ): Promise<View> {
    const view = makeView(data)

    await this.prisma.view.create({
      data: PrismaViewMapper.toPersistence(view)
    })

    return view
  }
}