import {NewsType} from "../components/App/interface";

interface CacheStorageType {
    id: string,
    isHidden?: boolean,
    votes?: number
}

let memoryCache: CacheStorageType[] = [];
(() => {
    try {
        const data = localStorage.getItem('STORY_DATA');
        if (data) {
            memoryCache = JSON.parse(data);
        }
    }
    catch (e) {
        console.log('skipped sync');
    }
})();

class LocalStorage {

    STORY_DATA = 'STORY_DATA';

    getData(): CacheStorageType[] | null {
        if (memoryCache.length) {
            return memoryCache;
        }
        const data = localStorage.getItem(this.STORY_DATA);
        if (data) {
            memoryCache = JSON.parse(data);
            return JSON.parse(data);
        }
        else {
            return null;
        }
    }

    storeData(data: CacheStorageType []) {
        memoryCache = data;
        localStorage.setItem(this.STORY_DATA, JSON.stringify(data));
    }
}

export class CacheStorage extends LocalStorage{

    cacheData: CacheStorageType;
    private allData: CacheStorageType[];

    constructor(id: string, isHidden?: boolean, votes?: number) {
        super();
        this.cacheData = {
            id,
            isHidden: !!isHidden,
            votes
        };
        this.allData = [];
    }

    private getCacheData(): CacheStorageType | null {
        const items =  this.getData();
        // if data is initialised
        if (items) {
            this.allData = items;
            const exist = items.find((item: {id: string}) => item.id === this.cacheData.id);
            if (exist) {
                return exist;
            }
            else {
                this.allData.push(this.cacheData);
                return this.cacheData;
            }
        }
        else {
            this.allData = [this.cacheData];
            // store data in local storage
            this.storeData([this.cacheData]);
            return this.cacheData;
        }
    }

    /*
    * Fetch value of news item stored in local storage
    * */
    getCache(): CacheStorageType | null {
        return this.getCacheData();
    }

    updateVotes() {
        const exist = this.getCacheData();
        if (exist) {
            const allData = this.allData.map(data => {
                if(data.id === this.cacheData.id){
                    this.cacheData.votes = this.cacheData.votes ? this.cacheData.votes+1 : 1;
                    return {
                        ...data,
                        votes: this.cacheData.votes
                    };
                }
                return data;
            });
            this.storeData(allData);
        }
    }

    setHidden() {
        const exist = this.getCacheData();
        if (exist) {
            const allData = this.allData.map(data => {
                if(data.id === this.cacheData.id){
                    return {
                        ...data,
                        isHidden: !this.cacheData.isHidden
                    }
                }
                return data;
            });
            this.storeData(allData);
            return true;
        }
        return false;
    }


}

export class SyncCacheStorage extends LocalStorage{

    private readonly data: NewsType[];

    constructor(data: NewsType[]) {
        super();
        this.data = data;
    }

    syncCache() {
        const items = this.getData();

        if (!items || !items.length) {
            return this.data;
        }

        return this.data.map(newsItem => {

            const exist = items.find((item: CacheStorageType) => {
                return item.id === newsItem.objectID;
            });

            if (exist) {
                return {
                    ...newsItem,
                    points: exist.votes !== undefined ? exist.votes : newsItem.points,
                    isHidden: exist.isHidden !== undefined ? exist.isHidden : newsItem.isHidden
                }
            }
            return newsItem;
        })
    }
}