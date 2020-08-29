import React from "react";
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Layout from './index';

Enzyme.configure({adapter: new EnzymeAdapter()});

const ChildComponent = () => {
    return (
        <p>Child Component</p>
    );
};

const wrapper = shallow(<Layout><ChildComponent /></Layout>);

test('Renders the Layout Component without errors', () => {
    const triangleComponent = wrapper.find('.appLayout');
    expect(triangleComponent.length).toBe(1);
});