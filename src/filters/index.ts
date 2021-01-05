import Vue from 'vue'
import { offer } from '@/libs/web3'

export const currency = Vue.filter('currency', (val: string | number) => {
  if (!val) return '0'
  if (val === 'NaN') console.warn('format currency failed: ', val)
  function formatDollar(num: number) {
    const p = num.toString().split(".")
    return p[0].split("").reverse().reduce(function (acc, num, i) {
      return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc
    }, "") + (p[1] ? "." + p[1] : '')
  }
  if (typeof val === 'string') {
    return formatDollar(parseFloat(val))
  } else {
    return formatDollar(val)
  }
})

export const decimal = Vue.filter('decimal', (val: string | number, fractionDigits = 3) => {
  let n = ''
  if (!val || isNaN(val as number)) return val
  if (typeof val === 'string') {
    n = parseFloat(val).toFixed(fractionDigits)
  } else {
    n = val.toFixed(fractionDigits)
  }
  const value = parseFloat(n)
  return value === 0 ? '0' : value.toString()
})

export const apy = Vue.filter('apy', (item: offer) => {
  const interests = parseFloat(item.interests)
  const duration = parseFloat(item.duration)
  const amountOut = parseFloat(item.amountOut)
  return ((interests / (duration / 6500) / amountOut) * 365) * 100
})