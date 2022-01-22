/**
 * File: /src/modules/redis/redisClient.provider.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-01-2022 05:42:12
 * Modified By: Clay Risser <email@clayrisser.com>
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

import Redis, { Redis as IRedis } from "ioredis";
import { ConfigService } from "@nestjs/config";
import { FactoryProvider } from "@nestjs/common";

export const REDIS_CLIENT = "REDIS_CLIENT";

const RedisClientProvider: FactoryProvider<IRedis> = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const password = config.get("REDIS_PASSWORD");
    return new Redis({
      db: Number(config.get("REDIS_DATABASE") || 0),
      family: 4,
      host: config.get("REDIS_HOST") || "localhost",
      port: Number(config.get("REDIS_PORT") || 6379),
      ...(password ? { password } : {}),
    });
  },
};

export default RedisClientProvider;
