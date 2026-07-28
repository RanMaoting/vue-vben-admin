import type { ZodType } from 'zod';

import { toRaw } from 'vue';

import { isObject, isString } from '@vben-core/shared/utils';

import { ZodDefault, ZodOptional, ZodPipe } from 'zod';

/**
 * Get the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
export function getBaseRules(schema?: null | string | ZodType): null | ZodType {
  if (!schema || isString(schema)) return null;
  const rawSchema = toRaw(schema);

  if (rawSchema instanceof ZodPipe) {
    return getBaseRules(rawSchema.in as ZodType);
  }

  if (rawSchema instanceof ZodDefault || rawSchema instanceof ZodOptional) {
    return getBaseRules(rawSchema.unwrap() as ZodType);
  }

  return rawSchema;
}

/**
 * Search for a "ZodDefault" in the Zod stack and return its value.
 */
export function getDefaultValueInZodStack(
  schema?: null | string | ZodType,
): any {
  if (!schema || isString(schema)) {
    return;
  }

  try {
    const result = toRaw(schema).safeParse(undefined);
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export function isEventObjectLike(obj: any) {
  if (!obj || !isObject(obj)) {
    return false;
  }
  return Reflect.has(obj, 'target') && Reflect.has(obj, 'stopPropagation');
}
