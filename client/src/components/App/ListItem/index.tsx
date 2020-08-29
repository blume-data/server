import React from 'react';
import './listItem.scss';
import {NewsType} from "../interface";
import moment from "moment";
import {getDomainNameFromUrl} from "../../../utils/tools";
import {Triangle} from '../../common/Triangle';

interface ListItemPropsType{
    isLoading: boolean;
    newsItem: NewsType;
    hiddenList: boolean;
    updateVote: (id: string) => void;
    toggleHide: (id: string) => void;
}

const ListItem = (props: ListItemPropsType) => {
    const {numComments=0, points=0, title='', url='', createdAt='', author='', objectID='', isHidden=false} = props.newsItem;
    const {isLoading, hiddenList=false} = props;
    const isValidDate = (new Date(createdAt)).getTime() > 0;

    function upVote() {
        props.updateVote(objectID);
    }
    const showItem = hiddenList ? isHidden : !isHidden;

    if(showItem) {
        return (
            <tr className={`app-list-item ${isLoading ? 'loading' : ''} ${isHidden && !hiddenList ? 'hidden' : ''}`}>
                <td align={'center'} className="num-comments">
                    <span aria-label={`${numComments} comments`}>{numComments}</span>
                </td>
                <td className="num-points">
                    <span aria-label={`${points} up-votes`}>{points}</span>
                </td>
                <td className="up-vote">
                    <button onClick={upVote} className={'accessibility'} aria-label={'up-vote'}>
                        <Triangle />
                    </button>
                </td>
                <td className="new-details">
                    <span className={'title'}>{title}</span>
                    <span className={'gray-font'}>
                    <a href={url}>{url ? `(${getDomainNameFromUrl(url)})` : ''}</a> by</span>
                    <span className='small-font'> {author}</span>
                    {
                        isValidDate
                            ? <span className={'gray-font'}> {moment([createdAt]).fromNow()} [</span>
                            : <span className="gray-font"> [</span>
                    }
                    <span onClick={() => props.toggleHide(objectID)}>
                    <button className={'accessibility small-font'}>{`${hiddenList ? 'un-hide' : 'hide'}`}</button>
                </span>
                    <span className="gray-font">]</span>

                </td>
            </tr>
        );
    }
    else return null;
};

export default ListItem;