/**
 * File: /src/modules/vote/vote.controller.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 08-05-2022 10:58:27
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ApiBody } from "@nestjs/swagger";
import { Logger, Controller, Post, Body } from "@nestjs/common";
import { Resource } from "@risserlabs/nestjs-keycloak";
import { PrismaService } from "~/modules/prisma";
import { CastResponseDto, CastRequestDto } from "./vote.dto";

@Resource("vote")
@Controller("vote")
export class VoteController {
  private readonly logger = new Logger(VoteController.name);

  constructor(private readonly prismaService: PrismaService) {}

  @Post("cast")
  @ApiBody({ type: CastRequestDto })
  async postLogin(
    @Body() body: CastRequestDto
  ): Promise<CastResponseDto | null> {
    const { globalId, address, nfts } = body;
    const propId = (
      await this.prismaService.prop.findFirst({
        where: { globalId },
      })
    )?.id;
    if (!propId) throw new Error(`prop ${globalId} does not exist`);
    const vote = await this.prismaService.vote.findFirst({
      where: {
        address,
        propId,
      },
    });
    if (vote) {
      throw new Error(
        `address ${address} already cast vote for prop ${globalId}`
      );
    }
    const count = this.calculateVoteCount(nfts);
    return this.prismaService.vote.create({
      data: {
        address,
        count,
        nfts,
        propId,
      },
    });
  }

  private calculateVoteCount(nfts: string[]): number {
    if (1 <= nfts.length && nfts.length < 3) {
      return 1;
    } else if (3 <= nfts.length && nfts.length < 7) {
      return 2;
    } else if (7 <= nfts.length) {
      return 3;
    }
    return 0;
  }
}
