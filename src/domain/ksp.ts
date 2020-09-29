import * as E from 'fp-ts/lib/Either'
import * as t from 'io-ts'

export const K = t.literal('K', 'kivi')
export type K = t.TypeOf<typeof K>
// TODO: obsolete
export function isK(a: string): a is K {
  return E.isRight(K.decode(a))
}

export const S = t.literal('S', 'sakset')
export type S = t.TypeOf<typeof S>
// TODO: obsolete
export function isS(a: string): a is S {
  return E.isRight(S.decode(a))
}

export const P = t.literal('P', 'peippöri')
export type P = t.TypeOf<typeof P>
// TODO: obsolete
export function isP(a: string): a is P {
  return E.isRight(P.decode(a))
}

export type KSP = K | S | P

export const maybeKSP = (a: unknown) => t.union([K,S,P]).decode(a)

const WINMAP: Record<KSP, KSP> = {
  K: 'P',
  P: 'S',
  S: 'K'
}
export const winnerKeyFor = (a: KSP): KSP => WINMAP[a]

// TODO: refactor this out
export const maybeWin = (a: KSP) => (b: KSP) =>
  (isK(a) && isS(b)) ||
  (isP(a) && isK(b)) ||
  (isS(a) && isP(b))

export const randomKSP = (): KSP =>
  [K.value, S.value, P.value][Math.floor(Math.random() * 3)]
