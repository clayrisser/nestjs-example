/**
 * File: /src/modules/rockets/rocket.controller.spec.ts
 * Project: app
 * File Created: 23-10-2022 07:10:05
 * Author: Clay Risser
 * -----
 * Last Modified: 23-10-2022 07:12:22
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

import { Test, TestingModule } from '@nestjs/testing';
import { RocketController } from './rocket.controller';

describe('RocketController', () => {
  let controller: RocketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RocketController],
    }).compile();

    controller = module.get<RocketController>(RocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
