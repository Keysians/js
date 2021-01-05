// declare const web3: any

type PromiseResolvedType<T> = T extends Promise<infer R> ? R : never
type ReturnedPromiseResolvedType<T extends (...args: any) => any> = PromiseResolvedType<ReturnType<T>>
