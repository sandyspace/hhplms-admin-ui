export function endWith(str, suffix) {
  return str.slice(-suffix.length) === suffix
}
