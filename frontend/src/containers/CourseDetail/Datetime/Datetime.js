import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Datetime.css';

class Datetime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: 0,
      hour: 0,
      minute: 0,
    };
    this.clickListener = this.clickListener.bind(this);
    this.timeString = (state) => {
      const hourString = `${state.hour}`;
      const minuteString = state.minute < 10 ? `0${state.minute}` : `${state.minute}`;
      return `${hourString}:${minuteString}`;
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.clickListener, true);
    this.handleChange(this.props.value);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickListener, true);
  }

  clickListener() {
    this.setState((prevState) => ({ dropdown: prevState.dropdown - 1 }));
  }

  toggleDropdown() {
    this.setState((prevState) => ({ dropdown: prevState.dropdown > 0 ? 0 : 1 }));
  }

  handleChange(str) {
    let numberOfColons = 0;
    let invalidString = false;
    for (let i = 0; i < str.length; i += 1) {
      const c = str[i];
      if (c === ':') numberOfColons += 1;
      else if (c < '0' || c > '9') {
        invalidString = true;
      }
    }
    if (invalidString || numberOfColons >= 2) return;
    this.props.onChange(str);
    const index = str.indexOf(':');
    const hour = parseInt(str.substring(0, index), 10);
    const minute = parseInt(str.substring(index + 1), 10);
    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
      this.setState({ hour, minute });
    }
  }

  handleBlur() {
    this.props.onChange(this.timeString(this.state));
  }

  changeHour(value) {
    this.setState((prevState) => {
      const nextHour = (prevState.hour + value + 24) % 24;
      const str = this.timeString({ hour: nextHour, minute: prevState.minute });
      this.props.onChange(str);
      return { dropdown: prevState.dropdown + 1, hour: nextHour };
    });
  }

  changeMinute(value) {
    this.setState((prevState) => {
      let nextMinute = prevState.minute + value;
      let nextHour = prevState.hour;
      if (nextMinute >= 60) {
        nextHour = (nextHour + 1) % 24;
        nextMinute -= 60;
      }
      if (nextMinute < 0) {
        nextHour = (nextHour + 23) % 24;
        nextMinute += 60;
      }
      const str = this.timeString({ hour: nextHour, minute: nextMinute });
      this.props.onChange(str);
      return { dropdown: prevState.dropdown + 1, hour: nextHour, minute: nextMinute };
    });
  }

  render() {
    return (
      <div className={`Datetime dropdown show ${this.props.className}`}>
        <input
          type="text"
          className="form-control form-control-sm"
          id="dropdown-time"
          onClick={() => this.toggleDropdown()}
          onBlur={() => this.handleBlur()}
          value={this.props.value}
          onChange={(event) => this.handleChange(event.target.value)}
        />
        {
        this.state.dropdown > 0
    && (
    <div className="dropdown-menu show">
      <table>
        <tbody>
          <tr>
            <td className="d-flex flex-row align-items-center">
              <div className="px-2">
                <span
                  className="btn-simple click"
                  role="button"
                  tabIndex={-1}
                  onMouseDown={() => this.changeHour(1)}
                >
▲
                </span>
                <div className="py-1">{this.state.hour}</div>
                <span
                  className="btn-simple click"
                  role="button"
                  tabIndex={-1}
                  onMouseDown={() => this.changeHour(-1)}
                >
▼
                </span>
              </div>
              <div className="px-1">:</div>
              <div className="px-2">
                <span
                  className="btn-simple click"
                  role="button"
                  tabIndex={-1}
                  onMouseDown={() => this.changeMinute(1)}
                >
▲
                </span>
                <div className="py-1">{this.state.minute >= 10 ? this.state.minute : `0${this.state.minute}`}</div>
                <span
                  className="btn-simple click"
                  role="button"
                  tabIndex={-1}
                  onMouseDown={() => this.changeMinute(-1)}
                >
▼
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    )
      }
      </div>
    );
  }
}

Datetime.defaultProps = {
  className: '',
  value: '00:00',
  onChange: () => {},
};

Datetime.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Datetime;
