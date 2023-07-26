import { v4 } from 'uuid'

export function uuid() {
  return v4()
}

export function getVersion() {
  return '0.0.1'
  // return Browser.runtime.getManifest().version
}

export function isProduction() {
  return false;
  // return !import.meta.env.DEV
}
