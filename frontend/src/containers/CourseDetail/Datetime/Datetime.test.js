import { mount } from 'enzyme';
import React from 'react';
import Datetime from './Datetime';

const mockOnChange = jest.fn(() => {});

describe('<Datetime />', () => {
  beforeEach(() => {});

  afterEach(() => { jest.clearAllMocks(); });

  it('Datetime render test', () => {
    const component = mount(<Datetime value="23:59" onChange={mockOnChange} />);
    const datetime = component.find('.Datetime');
    expect(datetime.length).toBe(1);
    component.unmount();
  });

  it('Should call onChange function when clicked hour up arrow', () => {
    const component = mount(<Datetime value="23:59" onChange={mockOnChange} />);
    const form = component.find('#datetime-form');
    form.simulate('click');
    const hourUp = component.find('#datetime-hour-up');
    hourUp.simulate('mousedown');
    expect(mockOnChange).toBeCalledTimes(2);
    expect(mockOnChange.mock.calls[1][0]).toBe('0:59');
  });

  it('Should call onChange function when clicked hour down arrow', () => {
    const component = mount(<Datetime value="23:59" onChange={mockOnChange} />);
    const form = component.find('#datetime-form');
    form.simulate('click');
    const hourDown = component.find('#datetime-hour-down');
    hourDown.simulate('mousedown');
    expect(mockOnChange).toBeCalledTimes(2);
    expect(mockOnChange.mock.calls[1][0]).toBe('22:59');
  });

  it('Should call onChange function when clicked minute up arrow', () => {
    const component = mount(<Datetime value="23:59" onChange={mockOnChange} />);
    const form = component.find('#datetime-form');
    form.simulate('click');
    const minuteUp = component.find('#datetime-minute-up');
    minuteUp.simulate('mousedown');
    expect(mockOnChange).toBeCalledTimes(2);
    expect(mockOnChange.mock.calls[1][0]).toBe('0:00');
  });

  it('Should call onChange function when clicked minute down arrow', () => {
    const component = mount(<Datetime value="0:00" onChange={mockOnChange} />);
    const form = component.find('#datetime-form');
    form.simulate('click');
    const minuteDown = component.find('#datetime-minute-down');
    minuteDown.simulate('mousedown');
    expect(mockOnChange).toBeCalledTimes(2);
    expect(mockOnChange.mock.calls[1][0]).toBe('23:59');
  });

  it('Should handle change when manually change value', () => {
    const component = mount(<Datetime value="23:59" onChange={mockOnChange} />);
    const form = component.find('#datetime-form');
    form.simulate('change', { target: { value: '11:20' } });
    expect(mockOnChange).toBeCalledTimes(2);
    expect(mockOnChange.mock.calls[1][0]).toBe('11:20');
  });

  it('Should fix time format when the form blurred', () => {
    const component = mount(<Datetime value="23:59" onChange={mockOnChange} />);
    const form = component.find('#datetime-form');
    form.simulate('change', { target: { value: '00001:20' } });
    form.simulate('blur');
    expect(mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]).toBe('1:20');
    form.simulate('change', { target: { value: 'KKKK' } });
    form.simulate('blur');
    expect(mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]).toBe('1:20');
  });

  it('Should call onChange when props.value changed', () => {
    const component = mount(<Datetime value="23:59" onChange={mockOnChange} />);
    component.setProps({ value: '22:59' });
    expect(mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]).toBe('22:59');
  });
});
