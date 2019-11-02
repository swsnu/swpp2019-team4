import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import App from './App';
import store from './store/store';

it('renders without crashing', () => {
  shallow(<App />);
  /*
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
    */
});
