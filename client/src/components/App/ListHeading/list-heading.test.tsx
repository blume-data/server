import React from "react";
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import {ListHeading} from './index';

Enzyme.configure({adapter: new EnzymeAdapter()});

const wrapper = shallow(<ListHeading />);

test('Renders the top heading links', () => {
    const headingLinks = wrapper.find('.heading-links');
    expect(headingLinks.length).toBe(4);
});