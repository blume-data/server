import React from "react";
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {DataNotFound} from './index';

Enzyme.configure({adapter: new EnzymeAdapter()});

const wrapper = shallow(<DataNotFound />);

test('Renders the Data Not Found Component without errors', () => {
    const component = wrapper.find('.data-not-found');
    expect(component.length).toBe(1);
});