/**
 * File: /src/@types/keycloakConnectToken.d.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-01-2022 05:43:19
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

declare module "keycloak-connect/middleware/auth-utils/token" {
  class Token {
    constructor(accessToken: string, clientId: string);
    token: string;
    isExpired(): boolean;
    hasRole(roleName: string): boolean;
    hasApplicationRole(appName: string, roleName: string): boolean;
    hasRealmRole(roleName: string): boolean;
  }
  export = Token;
}
