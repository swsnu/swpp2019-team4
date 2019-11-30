import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = (props) => (
  <div className="SearchBar input-group my-2">
    <div className="input-group-prepend">
      <button className="form-control" type="button" id="recommend-search-filter">
        <div className="oi oi-target" />
      </button>
    </div>
    <input
      type="text"
      className="form-control"
      id="recommend-search-name"
      placeholder="과목명"
      value={props.value}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
    />
    <div className="input-group-append">
      <button className="btn btn-dark" type="button" id="recommend-search-button" onClick={props.onSearch}>
        <div className="oi oi-magnifying-glass" />
      </button>
    </div>
  </div>
);

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};


export default SearchBar;
