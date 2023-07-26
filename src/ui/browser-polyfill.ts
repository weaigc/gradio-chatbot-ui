import { getMany, set, del, clear } from 'idb-keyval';

const Storage = {
  async get(key: string | string[] | null): Promise<any> {
    if (key === null) return null;
    if (typeof key === 'string') {
      key = [key]
    }
    const returnData: Record<string, any> = {}
    const values = await getMany(key)
    key.forEach((k, idx)=> {
      returnData[k] = values[idx]
    })
    return returnData;
  },
  async set(object: any) {
    for (let key of Object.keys(object)) {
      await set(key, object[key])
    }
  },
  async remove(key: string) {
    return del(key);
  },
  async clear() {
    return clear();
  }
}

const initalSize = parseInt(getComputedStyle(document.documentElement).fontSize, 10);
const Browser = {
  storage: {
    sync: Storage,
    local: Storage,
  },
  runtime: {
    getURL(url: string) {
      return url;
    }
  },
  tabs: {
    async getZoom() {
      const size = parseInt(getComputedStyle(document.documentElement).fontSize, 10);
      return size / initalSize;
    },
    async setZoom(size: number) {
      document.documentElement.style.fontSize = size * initalSize + 'px';
    }
  }
}

export const ofetch = (url: string, options?: RequestInit) => {
  return fetch(`/api/proxy?url=${encodeURI(url)}`, options).then(res => res.json());
}
export const FetchError = Error;

export default Browser;
