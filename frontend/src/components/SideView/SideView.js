import React from 'react';
import './SideView.css';
import { checkPropTypes } from 'prop-types';

const SideView = (props) => {
    let view = props.list.map((item) => (
        <li key={item.id}>
            <button type="button" onClick={() => props.onClick(item.id)}>
                {item.title + props.info}
            </button>
        </li>
    ))
    return (
        <ul className={props.className}>
            {view}
        </ul>
    )
}

export default SideView;