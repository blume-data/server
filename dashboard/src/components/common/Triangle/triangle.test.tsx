import React from "react";
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {Triangle} from './index';

Enzyme.configure({adapter: new EnzymeAdapter()});

const wrapper = shallow(<Triangle />);

test('Renders the Triangle Component without errors', () => {
    const triangleComponent = wrapper.find('.up-triangle');
    expect(triangleComponent.length).toBe(1);
});