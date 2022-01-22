/**
 * File: /src/modules/todo/todo.service.ts
 * Project: example-nestjs
 * File Created: 02-01-2022 11:01:05
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-01-2022 05:41:29
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

import {
  HasuraEvent,
  TrackedHasuraEventHandler,
} from "@golevelup/nestjs-hasura";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class TodoService {
  @TrackedHasuraEventHandler({
    triggerName: "todo_created",
    tableName: "ToDo",
    definition: { type: "insert" },
  })
  handleTodoCreated(_evt: HasuraEvent) {}
}
