import * as E from 'fp-ts/lib/Either'
import * as t from 'io-ts'

export const K = t.literal('K', 'kivi')
export type K = t.TypeOf<typeof K>
export function isK(a: string): a is K {
  return E.isRight(K.decode(a))
}

export const S = t.literal('S', 'sakset')
export type S = t.TypeOf<typeof S>
export function isS(a: string): a is S {
  return E.isRight(S.decode(a))
}

export const P = t.literal('P', 'peippöri')
export type P = t.TypeOf<typeof P>
export function isP(a: string): a is P {
  return E.isRight(P.decode(a))
}

export type KSP = K | S | P

export const maybeKSP = (a: unknown) => t.union([K,S,P]).decode(a)

export const maybeWin = (b: KSP) => (a: KSP) =>
  (isK(a) && isS(b)) ||
  (isP(a) && isK(b)) ||
  (isS(a) && isP(b))

export const randomKSP = (): KSP =>
  [K.value, S.value, P.value][Math.floor(Math.random() * 3)]