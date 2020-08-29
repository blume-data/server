import {NewsType, RawNewsType} from "../components/App/interface";

export function cleanNewsData(news: RawNewsType[]): NewsType[] {
    return news.map(newsItem => {
        return {
            createdAt: newsItem.created_at,
            isHidden: false,
            numComments: newsItem.num_comments,
            author: newsItem.author,
            points: 0,
            title: newsItem.title,
            objectID: newsItem.objectID,
            url: newsItem.url
        }
    });
}

export function getDomainNameFromUrl(url: string) {
    return url.replace('http://', '')
        .replace('https://', '')
        .split('/')[0];
}

export function getChartData(news: NewsType[]) {
    return news.map(newsItem => {
        return {
            y: newsItem.points,
            x: newsItem.objectID
        }
    });
}