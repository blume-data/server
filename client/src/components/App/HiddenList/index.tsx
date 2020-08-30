import React, {useEffect, useState} from 'react';
import './hidden-list.scss';
import {NewsType} from "../interface";
import ListItem from "../ListItem";
import {Triangle} from '../../common/Triangle';
import { ListHeading } from '../ListHeading';

interface HiddenListPropsType{
    news: NewsType[];
    isLoading: boolean;
    updateVote: (id: string) => void;
    toggleHide: (id: string) => void;
}

export const HiddenList = (props: HiddenListPropsType) => {
    const {isLoading=false, news} = props;

    const [isListEmpty, setIsListEmpty] = useState<boolean>(false);

    const [panelHidden, setHiddenPanel] = useState<boolean>(true);

    useEffect(() => {
        const hasItems = news.find(newsItem => newsItem.isHidden);
        setIsListEmpty(!hasItems);
    }, [news]);

    function renderList() {
        return (
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                <ListHeading />
                {news.map((newsItem, index) => <ListItem
                    updateVote={props.updateVote}
                    toggleHide={props.toggleHide}
                    hiddenList={true}
                    key={index}
                    isLoading={isLoading}
                    newsItem={newsItem}
                />)}
                </tbody>
            </table>
        );
    }

    if (isListEmpty) {
        return null;
    }
    else {
        return (
            <div className={'hidden-list'}>
                <div className={'panel'} onClick={() => setHiddenPanel(!panelHidden)}>
                <span className={'panel-label'}>
                    {`${panelHidden ? 'Open' : 'Close'}`} hidden list
                </span>
                    <button className={'accessibility '} aria-label={`${panelHidden ? 'open list' : 'close list'}`}>
                        <Triangle
                            className={`${panelHidden ? '' : 'closed'}`}
                        />
                    </button>
                </div>
                {
                    panelHidden
                        ? null
                        : renderList()
                }
            </div>
        );
    }
};