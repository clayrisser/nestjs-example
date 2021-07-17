/**
 * File: /src/hideSecrets.ts
 * Project: example-nestjs
 * File Created: 17-07-2021 02:46:31
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 17-07-2021 04:41:29
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

import YAML from 'yaml';
import { DeepMap, HashMap } from '~/types';

export const defaultKeyMatchers = [/password/, /token/, /secret/];
export const defaultValueMatchers = [];

export default class HideSecrets {
  public options: HideSecretsOptions;
  private static JSON_SPLIT_REGEX = /(?<=:(\s)*".*"[}\s]*})[^{}]*(?={)/g;
  private static JSON_MATCH_REGEX = /{(.|\n)*}/g;

  constructor(options: Partial<HideSecretsOptions> = {}) {
    this.options = {
      placeholder: '<<<SECRET>>>',
      enabled: true,
      ...options,
      keyMatchers: [...new Set(options.keyMatchers || defaultKeyMatchers)],
      valueMatchers: [...new Set(options.valueMatchers || defaultValueMatchers)]
    };
  }

  filter<T = string | DeepMap | string[] | DeepMap[]>(
    data: T,
    smartParse: boolean | 'json' | 'yaml' = true,
    depth?: number
  ): T {
    if (!this.options.enabled) return data;
    try {
      if (typeof data === 'string' && smartParse) {
        if (smartParse === true || smartParse === 'json') {
          let json: HashMap | null = null;
          try {
            json = JSON.parse(data);
          } catch (err) {
            // noop
          }
          if (json) {
            return JSON.stringify(
              this.filterStructured(json, depth)
            ) as unknown as T;
          }
        }
        if (smartParse === true || smartParse === 'yaml') {
          let yaml: HashMap | null = null;
          try {
            const possibleYaml = YAML.parse(data);
            if (
              typeof possibleYaml !== 'string' &&
              ((Array.isArray(yaml) && possibleYaml.length) ||
                (typeof yaml === 'object' && Object.keys(possibleYaml).length))
            ) {
              yaml = possibleYaml;
            }
          } catch (err) {
            // noop
          }
          if (yaml) {
            return YAML.stringify(
              this.filterStructured(yaml, depth)
            ) as unknown as T;
          }
        }
        if (smartParse === true) {
          const jsonMatches = this.findJson(data);
          if (jsonMatches.length) {
            return jsonMatches.reduce((newData: string, jsonMatch: string) => {
              return newData.replace(
                jsonMatch,
                this.filter(jsonMatch, 'json', depth)
              );
            }, data) as unknown as T;
          }
        }
      }
      return this.filterStructured(data, depth);
    } catch (err) {
      return data;
    }
  }

  private findJson(data: string) {
    return data
      .split(HideSecrets.JSON_SPLIT_REGEX)
      .reduce((matches: string[], item?: string) => {
        if (item) {
          matches.push(
            Array.from(item.match(HideSecrets.JSON_MATCH_REGEX) || [])?.[0] ||
              item
          );
        }
        return matches;
      }, []);
  }

  private filterStructured<T = string | DeepMap | string[] | DeepMap[]>(
    data: T,
    depth?: number
  ): T {
    if (typeof depth === 'number' && depth <= 0) return data;
    if (typeof data === 'string') {
      return this.options.valueMatchers.reduce(
        (filteredData: string, matcher: string | RegExp) => {
          return filteredData.replace(
            matcher === 'string' ? new RegExp(matcher, 'g') : matcher,
            this.options.placeholder
          );
        },
        ''
      ) as unknown as T;
    }
    if (Array.isArray(data)) {
      return data.map((item: string | DeepMap) =>
        this.filterStructured(item, typeof depth === 'number' ? --depth : depth)
      ) as unknown as T;
    }
    if (typeof data === 'object') {
      return Object.entries(data).reduce(
        (newData: DeepMap, [key, value]: [string, any]) => {
          let filterKey = false;
          this.options.keyMatchers.every((matcher: string | RegExp) => {
            if (
              typeof matcher === 'string' ? key === matcher : matcher.test(key)
            ) {
              filterKey = true;
              return false;
            }
            return true;
          });
          if (filterKey) {
            newData[key] = this.options.placeholder;
            return newData;
          }
          newData[key] = this.filterStructured(
            value,
            typeof depth === 'number' ? --depth : depth
          );
          return newData;
        },
        {}
      ) as unknown as T;
    }
    return data;
  }
}

export interface HideSecretsOptions {
  enabled: boolean;
  keyMatchers: (string | RegExp)[];
  placeholder: string;
  valueMatchers: (string | RegExp)[];
}
