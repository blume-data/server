import React from "react";
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import ListItem from "./index";

Enzyme.configure({adapter: new EnzymeAdapter()});

const sampleNews = {
    author: "razer6",
    createdAt: "2019-01-07T17:03:59.000Z",
    isHidden: false,
    numComments: 685,
    objectID: "18847043",
    points: 2867,
    title: "Announcing unlimited free private repos",
    url: "http://example.com"
};

const wrapper = shallow(<ListItem
    hiddenList={false}
    newsItem={sampleNews}
    isLoading={false}
    toggleHide={() => {}}
    updateVote={() => {}}
/>);

test('Renders the List Item Component without errors', () => {
    const listComponent = wrapper.find('.app-list-item');
    expect(listComponent.length).toBe(1);
});

test('Renders the List Item comment', () => {
    const numComments = wrapper.find('td.num-comments');
    const text = numComments.find('span').text();
    expect(text).toBe(`685`);
});

test('Renders the list Item up votes', () => {
    const upVotes = wrapper.find('.num-points');
    const points = upVotes.find('span').text();
    expect(points).toBe(`2867`);
});

test('Renders the news title', () => {
    const title = wrapper.find('td.new-details');
    const text = title.find('span.title').text();
    expect(text).toBe(sampleNews.title);
});

test('Renders the correct url', () => {
    const newsDetails = wrapper.find('td.new-details');
    const text = newsDetails.find('a').text();
    expect(text).toBe(`(example.com)`);
});

test('Renders the name of author', () => {
    const newsDetails = wrapper.find('td.new-details');
    const text = newsDetails.find('span.small-font').text();
    expect(text).toBe(` ${sampleNews.author}`);
});
