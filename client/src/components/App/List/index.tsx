import React from 'react';
import './list.scss';
import {NewsType} from "../interface";
import ListItem from '../ListItem';
import { useHistory } from "react-router"
import {DataNotFound} from "./DataNotFound";
import {HiddenList} from "../HiddenList";
import { ListHeading } from '../ListHeading';

interface ListPropType {
    news: NewsType[],
    fetchNews: (page: number) => void,
    page: number,
    isLoading: boolean,
    updateVote: (id: string) => void;
    toggleHide: (id: string) => void;
}

export default (props: ListPropType) => {

    const {news, fetchNews, page, isLoading} = props;
    const history = useHistory();

    function renderList () {
        return (
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                <ListHeading />
                {news.map((newsItem, index) => <ListItem
                    key={index}
                    updateVote={props.updateVote}
                    toggleHide={props.toggleHide}
                    hiddenList={false}
                    isLoading={isLoading}
                    newsItem={newsItem}
                />)}
                </tbody>
            </table>
        )
    }

    function turnPage(next?: boolean) {
        if (!isLoading) {
            if (next) {
                fetchNews(page+1);
                history.push(`/?page=${page+1}`);
            }
            else if(page>1) {
                fetchNews(page-1);
                history.push(`/?page=${page-1}`);
            }
        }
    }

    return (
        <div className={'app-list'}>
            <div className="list">
                {
                    (news && news.length) || page === 1 || isLoading
                        ? renderList()
                        : <DataNotFound />
                }
            </div>
            <HiddenList
                news={news}
                updateVote={props.updateVote}
                toggleHide={props.toggleHide}
                isLoading={isLoading}
            />
            {
                !isLoading
                ? <span className={'action-button'}>
                    <button id={'previous-button'} className={`buttons ${isLoading ? 'disabled' : ''}`} onClick={() => turnPage()}>Previous</button>
                    |
                    <button id={'next-button'} className={`buttons ${isLoading ? 'disabled' : ''}`} onClick={() => turnPage(true)}>Next</button>
                  </span>
                : null
            }
        </div>
    )

};