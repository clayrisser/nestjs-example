/**
 * File: /src/modules/typegraphql/cacheControl.decorator.ts
 * Project: example-nestjs
 * File Created: 21-07-2021 21:47:51
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 22-07-2021 00:49:28
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
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

import { CacheHint } from 'apollo-server-types';
import { Directive } from 'type-graphql';

export function CacheControl({ maxAge, scope }: CacheHint) {
  if (!maxAge && !scope) {
    throw new Error('Missing maxAge or scope param for @CacheControl');
  }
  let sdl = '@cacheControl(';
  if (maxAge) sdl += `maxAge: ${maxAge}`;
  if (scope) sdl += ` scope: ${scope}`;
  sdl += ')';
  return Directive(sdl);
}
