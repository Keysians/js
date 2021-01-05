/** @ts-ignore  */
export const nil: any = () => null

export const delay = (timeout = 0) => new Promise((resolve, reject) => setTimeout(resolve, timeout))