import { mount } from 'enzyme';
import React from 'react';
import SearchBar from './SearchBar';

describe('<SearchBar />', () => {
  afterEach(() => { jest.clearAllMocks(); });
  it('SearchBar render test', () => {
    const searchValues = {
      title: 'T',
      classification: 'C',
      department: 'D',
      degree_program: 'D',
      academic_year: 'A',
      course_number: 'C',
      lecture_number: 'L',
      professor: 'P',
      language: 'L',
      min_credit: '',
      max_credit: '',
      min_score: '',
      max_score: '',
    };
    const component = mount(
      <SearchBar
        value={searchValues}
        onChange={() => {}}
        onKeyDown={() => {}}
        onToggle={() => {}}
        onSearch={() => {}}
        searching={false}
        searchScore
      />,
    );
    expect(component.find('#recommend-search-filter').length).toBe(1);
    component.find('#recommend-search-filter').simulate('click');
    expect(component.find('#recommend-search-button').length).toBe(1);
    component.find('#recommend-search-button').simulate('click');
    expect(component.find('#recommend-search-title').length).toBe(1);
    component.find('#recommend-search-title').simulate('change', { target: { value: 'A' } });
    component.find('#recommend-search-title').simulate('keydown', 13);
    expect(component.find('#recommend-search-classification').length).toBe(1);
    component.find('#recommend-search-classification').simulate('change', { target: { value: 'A' } });
    expect(component.find('#recommend-search-department').length).toBe(1);
    component.find('#recommend-search-department').simulate('change', { target: { value: 'A' } });
    expect(component.find('#recommend-search-degree-program').length).toBe(1);
    component.find('#recommend-search-degree-program').simulate('change', { target: { value: 'A' } });
    expect(component.find('#recommend-search-academic-year').length).toBe(1);
    component.find('#recommend-search-academic-year').simulate('change', { target: { value: 'A' } });
    expect(component.find('#recommend-search-course-number').length).toBe(1);
    component.find('#recommend-search-course-number').simulate('change', { target: { value: 'A' } });
    expect(component.find('#recommend-search-lecture-number').length).toBe(1);
    component.find('#recommend-search-lecture-number').simulate('change', { target: { value: 'A' } });
    expect(component.find('#recommend-search-professor').length).toBe(1);
    component.find('#recommend-search-professor').simulate('change', { target: { value: 'A' } });
    expect(component.find('#recommend-search-language').length).toBe(1);
    component.find('#recommend-search-language').simulate('change', { target: { value: 'A' } });
    expect(component.find('#recommend-search-min-credit').length).toBe(1);
    component.find('#recommend-search-min-credit').simulate('change', { target: { value: 0 } });
    expect(component.find('#recommend-search-max-credit').length).toBe(1);
    component.find('#recommend-search-max-credit').simulate('change', { target: { value: 0 } });
    expect(component.find('#recommend-search-min-score').length).toBe(1);
    component.find('#recommend-search-min-score').simulate('change', { target: { value: 0 } });
    expect(component.find('#recommend-search-max-score').length).toBe(1);
    component.find('#recommend-search-max-score').simulate('change', { target: { value: 0 } });
  });
  it('SearchBar-searching render test', () => {
    const searchValues = {
      title: 'TT',
      classification: 'CS',
      department: 'DP',
      degree_program: 'DP',
      academic_year: 'AY',
      course_number: 'CN',
      lecture_number: 'LN',
      professor: 'PF',
      language: 'LG',
      min_credit: '',
      max_credit: '',
      min_score: '',
      max_score: '',
    };
    const component = mount(
      <SearchBar
        value={searchValues}
        onChange={() => {}}
        onKeyDown={() => {}}
        onToggle={() => {}}
        onSearch={() => {}}
        searching
        searchScore={false}
      />,
    );
    expect(component.find('#recommend-search-button').props().disabled).not.toBe(undefined);
    expect(component.find('#recommend-search-min-score').length).toBe(0);
    expect(component.find('#recommend-search-max-score').length).toBe(0);
  });
  it('SearchBar-no value render test', () => {
    const searchValues = {
      title: '',
      classification: '',
      department: '',
      degree_program: '',
      academic_year: '',
      course_number: '',
      lecture_number: '',
      professor: '',
      language: '',
      min_credit: '',
      max_credit: '',
      min_score: '',
      max_score: '',
    };
    const component = mount(
      <SearchBar
        value={searchValues}
        onChange={() => {}}
        onKeyDown={() => {}}
        onToggle={() => {}}
        onSearch={() => {}}
        searching
        searchScore={false}
      />,
    );
    expect(component.find('#recommend-search-button').props().disabled).not.toBe(undefined);
    expect(component.find('#recommend-search-min-score').length).toBe(0);
    expect(component.find('#recommend-search-max-score').length).toBe(0);
  });
});
