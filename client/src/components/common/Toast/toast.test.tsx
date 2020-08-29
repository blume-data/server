import React from "react";
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {Toast} from './index';

Enzyme.configure({adapter: new EnzymeAdapter()});

const errorMessage = 'Network Error';
const wrapper = shallow(<Toast errors={errorMessage} />);

test('Renders the Toast Component without errors', () => {
    const triangleComponent = wrapper.find('#toast');
    expect(triangleComponent.length).toBe(1);
    expect(triangleComponent.text()).toBe(errorMessage);
});