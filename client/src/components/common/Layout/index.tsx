import React from 'react';
import './index.scss'
import Footer from '../Footer';

export interface PropsType {
    rootClass?: string;
    id?: string;
    children: JSX.Element;
}

export default (props: PropsType) => {
    const {children} = props;
    return (
        <div className="appLayout">
            {children}
            <Footer />
        </div>
    );
}