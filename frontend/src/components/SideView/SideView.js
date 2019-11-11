import React from 'react';
import './SideView.css';

const SideView = (props) => {
  const view = props.list.map((item) => (
    <li key={item.id}>
      <button type="button" className="item" onClick={() => props.onClick(item.id)}>
        {item.title}
      </button>
    </li>
  ));
  return (
    <ul className={props.className}>
      {view}
    </ul>
  );
};

SideView.propTypes = {

};
export default SideView;
