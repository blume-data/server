import React from "react";
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import List from './index';

Enzyme.configure({adapter: new EnzymeAdapter()});

const wrapper = shallow(<List
    fetchNews={() => {}}
    news={[]}
    isLoading={false}
    page={1}
    toggleHide={() => {}}
    updateVote={() => {}}
/>);

test('Renders the List Component without errors', () => {
    const listComponent = wrapper.find('.app-list');
    expect(listComponent.length).toBe(1);
});

test('Renders Previous Button', () => {
    const previousButton = wrapper.find('#previous-button');
    expect(previousButton.length).toBe(1);
});

test('Renders Previous Button', () => {
    const nextButton = wrapper.find('#next-button');
    expect(nextButton.length).toBe(1);
});

