import React from "react";
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import {HiddenList} from "./index";

Enzyme.configure({adapter: new EnzymeAdapter()});

const sampleNews = {
    author: "razer6",
    createdAt: "2019-01-07T17:03:59.000Z",
    isHidden: true,
    numComments: 685,
    objectID: "18847043",
    points: 2867,
    title: "Announcing unlimited free private repos",
    url: "http://example.com"
};

const wrapper = shallow(<HiddenList
    news={[sampleNews]}
    isLoading={false}
    toggleHide={() => {}}
    updateVote={() => {}}
/>);

test('Renders the Hidden List Item Component without errors', () => {
    const listComponent = wrapper.find('.hidden-list');
    expect(listComponent.length).toBe(1);
});

test('Renders the panel', () => {
    const panel = wrapper.find('.panel');
    expect(panel.length).toBe(1);
    const panelLabel = wrapper.find('.panel-label').text();
    expect(panelLabel).toBe('Open hidden list');
});
