import React from "react";
import {Link} from "react-router-dom";
import './list-heading.scss';
export const ListHeading = () => {
    return (
        <tr className={'heading'}>
            <td className={'heading-links'}>
                <Link aria-label={'comments'} to={'/'}>Comments</Link>
            </td>
            <td className={'vote-count heading-links'}>
                <Link aria-label={'vote count'} to={'/'}>Vote Count</Link>
            </td>
            <td className={'heading-links'}>
                <Link aria-label={'up vote'} to={'/'}>Up Vote</Link>
            </td>
            <td className={'td-news-details heading-links'}>
                <Link aria-label={'news details'} to={'/'}>News Details</Link>
            </td>
        </tr>
    );
};