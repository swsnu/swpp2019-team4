import React from 'react';
import PropTypes from 'prop-types';
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
  list: PropTypes.shape({
    map: PropTypes.func.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};
export default SideView;
