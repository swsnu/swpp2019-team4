import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = (props) => (
  <div className="searching-div">
    <div className="SearchBar input-group my-2">
      <div className="input-group-prepend">
        <button className="form-control" type="button" id="recommend-search-filter" onClick={props.onToggle}>
          <div className="oi oi-target" />
        </button>
      </div>
      <input
        type="text"
        className="form-control"
        id="recommend-search-title"
        placeholder="과목명"
        value={props.value.title}
        onChange={(event) => props.onChange(event, 'title')}
        onKeyDown={props.onKeyDown}
      />
      <div className="input-group-append">
        <button className="btn btn-dark" type="button" id="recommend-search-button" onClick={props.onSearch}>
          <div className="oi oi-magnifying-glass" />
        </button>
      </div>
    </div>
    {(props.togglestatus
      ? (
        <div className="detail-search-filter">
        교과구분:
          <input
            type="text"
            className="form-control"
            id="recommend-search-classification"
            placeholder="교양/전선/전필..."
            value={props.value.classification}
            onChange={(event) => props.onChange(event, 'classification')}
            onKeyDown={props.onKeyDown}
          />
        개설학과:
          <input
            type="text"
            className="form-control"
            id="recommend-search-department"
            placeholder="공대/컴공/컴퓨터공학부..."
            value={props.value.department}
            onChange={(event) => props.onChange(event, 'department')}
            onKeyDown={props.onKeyDown}
          />
        이수과정:
          <input
            type="text"
            className="form-control"
            id="recommend-search-degree_program"
            placeholder="학사/석사/석박사통합..."
            value={props.value.degree_program}
            onChange={(event) => props.onChange(event, 'degree_program')}
            onKeyDown={props.onKeyDown}
          />
        학년:
          <input
            type="text"
            className="form-control"
            id="recommend-search-academic_year"
            placeholder="1학년/2/3..."
            value={props.value.academic_year}
            onChange={(event) => props.onChange(event, 'academic_year')}
            onKeyDown={props.onKeyDown}
          />
        교과목번호:
          <input
            type="text"
            className="form-control"
            id="recommend-search-course_number"
            placeholder="M1522.002400/M2177.004900..."
            value={props.value.course_number}
            onChange={(event) => props.onChange(event, 'course_number')}
            onKeyDown={props.onKeyDown}
          />
        강좌번호:
          <input
            type="text"
            className="form-control"
            id="recommend-search-lecture_number"
            placeholder="001/002/003..."
            value={props.value.lecture_number}
            onChange={(event) => props.onChange(event, 'lecture_number')}
            onKeyDown={props.onKeyDown}
          />
        주담당교수:
          <input
            type="text"
            className="form-control"
            id="recommend-search-professor"
            placeholder="전병곤..."
            value={props.value.professor}
            onChange={(event) => props.onChange(event, 'professor')}
            onKeyDown={props.onKeyDown}
          />
        강의언어:
          <input
            type="text"
            className="form-control"
            id="recommend-search-language"
            placeholder="한국어/영어..."
            value={props.value.language}
            onChange={(event) => props.onChange(event, 'language')}
            onKeyDown={props.onKeyDown}
          />
        최소학점:
          <input
            type="number"
            className="form-control"
            id="recommend-search-min_credit"
            placeholder="1/2/3..."
            value={props.value.min_credit}
            onChange={(event) => props.onChange(event, 'min_credit')}
            onKeyDown={props.onKeyDown}
          />
        최대학점:
          <input
            type="number"
            className="form-control"
            id="recommend-search-max_credit"
            placeholder="1/2/3..."
            value={props.value.max_credit}
            onChange={(event) => props.onChange(event, 'max_credit')}
            onKeyDown={props.onKeyDown}
          />
        {props.searchScore
        ?(
          <div className="search-score">
            최소평점:
              <input
                type="number"
                className="form-control"
                id="recommend-search-min_score"
                placeholder="0/1.234/9.9..."
                value={props.value.min_score}
                onChange={(event) => props.onChange(event, 'min_score')}
                onKeyDown={props.onKeyDown}
              />
            최대평점:
              <input
                type="number"
                className="form-control"
                id="recommend-search-max_score"
                placeholder="0/1.234/9.9..."
                value={props.value.max_score}
                onChange={(event) => props.onChange(event, 'max_score')}
                onKeyDown={props.onKeyDown}
              />
          </div>
        )
        :null}
        </div>
      )
      : null)}
  </div>
);

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};


export default SearchBar;
