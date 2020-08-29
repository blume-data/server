export interface RawNewsType {
    num_comments: number,
    objectID: string,
    author: string,
    title: string,
    points: number,
    created_at: string,
    url: string,
    hidden?: boolean;
}

export interface NewsType {
    numComments: number,
    objectID: string,
    author: string,
    title: string,
    points: number,
    createdAt: string,
    url: string,
    isHidden: boolean,
}

export interface NewsDataType {
    news: NewsType[],
    page: number,
}

export interface ChartDataType {
    y: number,
    x: string
}