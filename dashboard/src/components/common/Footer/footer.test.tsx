import React from "react";
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Footer from './index';

Enzyme.configure({adapter: new EnzymeAdapter()});

const wrapper = shallow(<Footer />);

test('Renders the Footer Component without errors', () => {
    const triangleComponent = wrapper.find('.appFooter');
    expect(triangleComponent.length).toBe(1);
});