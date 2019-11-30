import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import TimetableRecommend from './TimetableRecommend';

import * as actionCreators from '../../store/actions/user';

const stubState = {
  user: { is_authenticated: true, timetable_main: 0 },
};

const stubStateFalse = {
  user: { is_authenticated: false, timetable_main: 0 },
};

function window(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={TimetableRecommend} />
          <Route path="/login" exact render={() => <div className="Login" />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

jest.mock('../../components/TopBar/TopBar', () => jest.fn((props) => (
  <div className="TopBar">
    <button type="button" className="text-black-50" id="logout-button" onClick={() => props.logout()}>
      x
    </button>
  </div>
)));

jest.mock('./RecommendConstraint/RecommendConstraint', () => jest.fn((props) => (
  <div className="Recommend_0">
    <button type="button" className="text-black-50" id="valid-button" onClick={() => props.handleValid(true)}>
      x
    </button>
  </div>
)));

jest.mock('./RecommendTime/RecommendTime', () => jest.fn(() => (
  <div className="Recommend_1" />
)));

jest.mock('./RecommendCourse/RecommendCourse', () => jest.fn(() => (
  <div className="Recommend_2" />
)));

jest.mock('./RecommendResult/RecommendResult', () => jest.fn(() => (
  <div className="Recommend_3" />
)));

describe('<TimetableRecommend />', () => {
  let spyGetSignout;

  beforeEach(() => {
    spyGetSignout = jest.spyOn(actionCreators, 'getSignout')
      .mockImplementation(() => () => {});
  });

  afterEach(() => { jest.clearAllMocks(); });

  it('Recommendation page render test', () => {
    const component = mount(window(stubState));
    const topbar = component.find('.TopBar');
    expect(topbar.length).toBe(1);
    expect(component.find('#recommend-back-button').length).toBe(0);
    expect(component.find('#recommend-next-button').length).toBe(1);
    expect(component.find('#valid-button').length).toBe(1);
    component.find('#valid-button').simulate('click');
    expect(component.find('.Recommend_0').length).toBe(1);
    component.find('#recommend-next-button').at(0).simulate('click');
    expect(component.find('.Recommend_1').length).toBe(1);
    expect(component.find('#recommend-back-button').length).toBe(1);
    expect(component.find('#recommend-next-button').length).toBe(1);
    component.find('#recommend-next-button').at(0).simulate('click');
    expect(component.find('.Recommend_2').length).toBe(1);
    component.find('#recommend-next-button').at(0).simulate('click');
    expect(component.find('.Recommend_3').length).toBe(1);
    expect(component.find('#recommend-back-button').length).toBe(1);
    expect(component.find('#recommend-next-button').length).toBe(0);
    component.find('#recommend-back-button').at(0).simulate('click');
    expect(component.find('.Recommend_2').length).toBe(1);
    component.find('#recommend-back-button').at(0).simulate('click');
    expect(component.find('.Recommend_1').length).toBe(1);
    component.find('#recommend-back-button').at(0).simulate('click');
    expect(component.find('.Recommend_0').length).toBe(1);
    expect(component.find('.small').length).toBe(4);
    expect(component.find('.bar').length).toBe(3);
  });

  it('should call signout when pressed logout button', () => {
    const component = mount(window(stubState));
    component.find('#logout-button').simulate('click');
    expect(spyGetSignout).toBeCalledTimes(1);
  });

  it('should redirect to login when is_authenticated is false', () => {
    const component = mount(window(stubStateFalse));
    expect(component.find('.Login').length).toBe(1);
  });
});
