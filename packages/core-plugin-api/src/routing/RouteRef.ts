/*
 * Copyright 2020 The Backstage Authors
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
  RouteRef,
  routeRefType,
  AnyParams,
  ParamKeys,
  OptionalParams,
} from './types';
import { OldIconComponent } from '../icons/types';

/**
 * @deprecated
 * @internal
 */
export type RouteRefConfig<Params extends AnyParams> = {
  params?: ParamKeys<Params>;
  path?: string;
  icon?: OldIconComponent;
  title: string;
};

/**
 * @internal
 */
export class RouteRefImpl<Params extends AnyParams>
  implements RouteRef<Params>
{
  // The marker is used for type checking while the symbol is used at runtime.
  declare $$routeRefType: 'absolute';
  readonly [routeRefType] = 'absolute';

  constructor(
    private readonly id: string,
    readonly params: ParamKeys<Params>,
    private readonly config: {
      /** @deprecated */
      path?: string;
      /** @deprecated */
      icon?: OldIconComponent;
      /** @deprecated */
      title?: string;
    },
  ) {
    if (config.path) {
      // eslint-disable-next-line no-console
      console.warn(
        `[core-plugin-api] - routeRefs no longer decide their own path, please remove the path for ${this.toString()}. This will be removed in upcoming versions.`,
      );
    }

    if (config.icon) {
      // eslint-disable-next-line no-console
      console.warn(
        `[core-plugin-api] - routeRefs no longer decide their own icon, please remove the icon for ${this.toString()}. This will be removed in upcoming versions.`,
      );
    }

    if (config.title) {
      // eslint-disable-next-line no-console
      console.warn(
        `[core-plugin-api] - routeRefs no longer decide their own title, please remove the title for ${this.toString()}. This will be removed in upcoming versions.`,
      );
    }
  }

  /** @deprecated use `useRouteRef` instead */
  get path() {
    return this.config.path ?? '';
  }

  get icon() {
    return this.config.icon;
  }

  get title() {
    return this.config.title ?? this.id;
  }

  toString() {
    return `routeRef{type=absolute,id=${this.id}}`;
  }
}

/**
 * Create a {@link RouteRef} from a route descriptor.
 *
 * @param config - Description of the route reference to be created.
 * @public
 */
export function createRouteRef<
  // Params is the type that we care about and the one to be embedded in the route ref.
  // For example, given the params ['name', 'kind'], Params will be {name: string, kind: string}
  Params extends { [param in ParamKey]: string },
  // ParamKey is here to make sure the Params type properly has its keys narrowed down
  // to only the elements of params. Defaulting to never makes sure we end up with
  // Param = {} if the params array is empty.
  ParamKey extends string = never,
>(config: {
  /** The id of the route ref, used to identify it when printed */
  id?: string;
  /** A list of parameter names that the path that this route ref is bound to must contain */
  params?: ParamKey[];
  /** @deprecated Route refs no longer decide their own path */
  path?: string;
  /** @deprecated Route refs no longer decide their own icon */
  icon?: OldIconComponent;
  /** @deprecated Route refs no longer decide their own title */
  title?: string;
}): RouteRef<OptionalParams<Params>> {
  const id = config.id || config.title;
  if (!id) {
    throw new Error('RouteRef must be provided a non-empty id');
  }
  return new RouteRefImpl(
    id,
    (config.params ?? []) as ParamKeys<OptionalParams<Params>>,
    config,
  );
}
