import React, {useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import './app.scss';
import List from './List';
import {RootState} from "../../rootReducer";
import {fetchNewsData, syncData, updateVote, toggleHide} from "./actions";
import { Toast } from '../common/Toast';

const mapState = (state: RootState) => ({
    newsData: state.newsData
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type AppProps = PropsFromRedux & {
    location: {
        search: string
    }
}

export function loadAppData(store: any, pageNo=1) {
    return store.dispatch(fetchNewsData(pageNo));
}

export const App = (props: AppProps) => {

    const {news, page, isLoading=false, errors} = props.newsData;

    function fetchNews(page=1) {
        props.fetchNewsData(page);
    }

    useEffect(() => {
        const pageNo = new URLSearchParams(props.location.search).get('page') || 1;
        if (Number(pageNo) !== page || !news.length) {
            fetchNews(Number(pageNo));
        }
        else {
            props.syncData();
        }
    }, []);

    return (
        <div className="App">
            <List
                updateVote={props.updateVote}
                toggleHide={props.toggleHide}
                isLoading={isLoading}
                page={page}
                news={news}
                fetchNews={fetchNews} />

            <Toast errors={errors || null} />
        </div>
    );
};

const connector = connect(mapState, {fetchNewsData, syncData, updateVote, toggleHide});
export default connector(App);
