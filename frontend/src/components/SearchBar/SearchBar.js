import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = (props) => {
  const keys = ['classification', 'department', 'degree_program', 'academic_year',
    'course_number', 'lecture_number', 'professor', 'language', 'min_credit', 'max_credit'];
  if (props.searchScore) {
    keys.push('min_score');
    keys.push('max_score');
  }
  let exist = false;
  keys.forEach(
    (key) => {
      if (props.value[key] !== '') exist = true;
    },
  );

  const radioList = props.sortValue.map((value, index) => {
    const inputId = "radio " + index;
    return (
        <div className="form-check">
        <input className="form-check-input" type="radio" name="sortRadio" id={inputId}
          onChange={() => props.onChange(index, 'sort')}
          checked={value['value']}
        />
        <label className="form-check-label" for={inputId}>
          {value['title']}
        </label>
      </div>
    );
  });

  return (
    <div className="SearchBar input-group my-2">
      <div className="input-group-prepend dropdown">
        <button
          className="form-control"
          type="button"
          id="recommend-search-filter"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div className={`oi oi-target ${exist ? 'text-danger' : ''}`} />
        </button>
        <div className="dropdown-menu p-4 my-1" style={{ width: '40rem' }}>
          <div className="row">
            <div className="col-6 m-0">
              <div className="form-group row">
                <label
                  htmlFor="recommend-search-classification"
                  className="col-4 col-form-label col-form-label-sm text-right"
                >
              교과구분
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm col-8"
                  id="recommend-search-classification"
                  value={props.value.classification}
                  onChange={(event) => props.onChange(event.target.value, 'classification')}
                  onKeyDown={props.onKeyDown}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="recommend-search-department"
                  className="col-4 col-form-label col-form-label-sm text-right"
                >
                개설학과
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm col-8"
                  id="recommend-search-department"
                  value={props.value.department}
                  onChange={(event) => props.onChange(event.target.value, 'department')}
                  onKeyDown={props.onKeyDown}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="recommend-search-degree-program"
                  className="col-4 col-form-label col-form-label-sm text-right"
                >
              이수과정
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm col-8"
                  id="recommend-search-degree-program"
                  value={props.value.degree_program}
                  onChange={(event) => props.onChange(event.target.value, 'degree_program')}
                  onKeyDown={props.onKeyDown}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="recommend-search-academic-year"
                  className="col-4 col-form-label col-form-label-sm text-right"
                >
                학년
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm col-8"
                  id="recommend-search-academic-year"
                  value={props.value.academic_year}
                  onChange={(event) => props.onChange(event.target.value, 'academic_year')}
                  onKeyDown={props.onKeyDown}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="recommend-search-course-number"
                  className="col-4 col-form-label col-form-label-sm text-right"
                >
                교과목번호
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm col-8"
                  id="recommend-search-course-number"
                  value={props.value.course_number}
                  onChange={(event) => props.onChange(event.target.value, 'course_number')}
                  onKeyDown={props.onKeyDown}
                />
              </div>
            </div>
            <div className="col-6 m-0">
              <div className="form-group row">
                <label
                  htmlFor="recommend-search-lecture-number"
                  className="col-4 col-form-label col-form-label-sm text-right"
                >
        강좌번호
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm col-8"
                  id="recommend-search-lecture-number"
                  value={props.value.lecture_number}
                  onChange={(event) => props.onChange(event.target.value, 'lecture_number')}
                  onKeyDown={props.onKeyDown}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="recommend-search-lecture-number"
                  className="col-4 col-form-label col-form-label-sm text-right"
                >
        주담당교수
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm col-8"
                  id="recommend-search-professor"
                  value={props.value.professor}
                  onChange={(event) => props.onChange(event.target.value, 'professor')}
                  onKeyDown={props.onKeyDown}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="recommend-search-language"
                  className="col-4 col-form-label col-form-label-sm text-right"
                >
        강의언어
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm col-8"
                  id="recommend-search-language"
                  value={props.value.language}
                  onChange={(event) => props.onChange(event.target.value, 'language')}
                  onKeyDown={props.onKeyDown}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="recommend-search-min-credit"
                  className="col-4 col-form-label col-form-label-sm text-right"
                >
                학점
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm col-4"
                  id="recommend-search-min-credit"
                  placeholder="최소"
                  value={props.value.min_credit}
                  onChange={(event) => props.onChange(event.target.value, 'min_credit')}
                  onKeyDown={props.onKeyDown}
                />
                <input
                  type="number"
                  className="form-control form-control-sm col-4"
                  id="recommend-search-max-credit"
                  placeholder="최대"
                  value={props.value.max_credit}
                  onChange={(event) => props.onChange(event.target.value, 'max_credit')}
                  onKeyDown={props.onKeyDown}
                />
              </div>
              {props.searchScore
                ? (
                  <div className="form-group row">
                    <label
                      htmlFor="recommend-search-min-credit"
                      className="col-4 col-form-label col-form-label-sm text-right"
                    >
                평점
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm col-4"
                      id="recommend-search-min-score"
                      placeholder="최소"
                      step="0.001"
                      value={props.value.min_score}
                      onChange={(event) => props.onChange(event.target.value, 'min_score')}
                      onKeyDown={props.onKeyDown}
                    />
                    <input
                      type="number"
                      className="form-control form-control-sm col-4"
                      id="recommend-search-max-score"
                      placeholder="최대"
                      step="0.001"
                      value={props.value.max_score}
                      onChange={(event) => props.onChange(event.target.value, 'max_score')}
                      onKeyDown={props.onKeyDown}
                    />
                  </div>
                )
                : null}
            </div>
          </div>
        </div>
      </div>
      {radioList.length > 0 && (
      <div className="input-group-prepend dropdown">
        <button
          className="form-control"
          type="button"
          id="recommend-search-filter"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          style={{borderRadius: "0"}}
        >
          <div className="oi oi-sort-ascending"/>
        </button>
        <div className="dropdown-menu p-4 my-1" style={{width: "12rem"}}>
          {radioList}
        </div>
      </div>
      )}
      <input
        type="text"
        className="form-control"
        id="recommend-search-title"
        placeholder="과목명"
        value={props.value.title}
        onChange={(event) => props.onChange(event.target.value, 'title')}
        onKeyDown={props.onKeyDown}
      />
      <div className="input-group-append">
        {(props.searching
          ? (
            <button
              className="btn btn-dark"
              type="button"
              id="recommend-search-button"
              onClick={props.onSearch}
              disabled
            >
              <div className="oi oi-magnifying-glass" />
            </button>
          )
          : (
            <button className="btn btn-dark" type="button" id="recommend-search-button" onClick={props.onSearch}>
              <div className="oi oi-magnifying-glass" />
            </button>
          ))}
      </div>
    </div>
  );
};

SearchBar.defaultProps = {
  searchScore: false,
  sortValue: [],
};

SearchBar.propTypes = {
  searchScore: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onChangeSortValue: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  value: PropTypes.shape({
    classification: PropTypes.string,
    department: PropTypes.string,
    degree_program: PropTypes.string,
    course_number: PropTypes.string,
    lecture_number: PropTypes.string,
    professor: PropTypes.string,
    min_credit: PropTypes.string,
    max_credit: PropTypes.string,
    min_score: PropTypes.string,
    max_score: PropTypes.string,
    language: PropTypes.string,
    academic_year: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  sortValue : PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.bool,
  })),
  searching: PropTypes.bool.isRequired,
};


export default SearchBar;
