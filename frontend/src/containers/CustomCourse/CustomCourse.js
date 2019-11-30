import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import { TwitterPicker } from 'react-color';
import * as actionCreators from '../../store/actions/index';
import './CustomCourse.css';
import 'react-datetime/css/react-datetime.css';

class CustomCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      time: [],
      color: '#f47373',
    };
  }

  resetState() {
    setTimeout(() => this.setState({
      title: '',
      time: [],
      color: '#f47373',
    }), 500);
  }

  postCustom(title, color, time) {
    const course = { title, color, time };
    this.props.onPostCustomCourse(this.props.timetableId, course);
    this.resetState();
  }

  appendTime() {
    this.setState((prevState) => {
      const { time } = prevState;
      time.push({
        week_day: 0,
        start_time: '12:00',
        end_time: '13:00',
      });
      return { time };
    });
  }

  deleteTime(index) {
    this.setState((prevState) => {
      const { time } = prevState;
      time.splice(index, 1);
      return { time };
    });
  }

  handleWeekday(index, value) {
    this.setState((prevState) => {
      const { time } = prevState;
      time[index].week_day = value;
      return { time };
    });
  }

  handleTime(index, key, moment) {
    if (typeof moment === 'string') return;
    const value = moment.format('H:mm');
    this.setState((prevState) => {
      const { time } = prevState;
      time[index][key] = value;
      return { time };
    });
  }

  render() {
    const segments = this.state.time.map((time, index) => (
      <div className="form-group row px-3 mb-0 mb-2" key={index}>
        <select
          className="form-control col-3"
          id="weekday-control"
          value={time.week_day}
          onChange={(event) => this.handleWeekday(index, event.target.value)}
        >
          <option value={0}>월</option>
          <option value={1}>화</option>
          <option value={2}>수</option>
          <option value={3}>목</option>
          <option value={4}>금</option>
          <option value={5}>토</option>
        </select>
        <Datetime
          className="col pr-0"
          dateFormat={false}
          timeFormat="H:mm"
          value={time.start_time}
          onChange={(moment) => this.handleTime(index, 'start_time', moment)}
        />
        <div className="col-1 px-0">
          <div className="w-100 text-center small text-black-50 pt-2">~</div>
        </div>
        <Datetime
          className="col px-0"
          dateFormat={false}
          timeFormat="H:mm"
          value={time.end_time}
          onChange={(moment) => this.handleTime(index, 'end_time', moment)}
        />
        <button
          className="col-1 px-1 btn btn-simple"
          type="button"
          id="delete-time-button"
          onClick={() => this.deleteTime(index)}
        >
          <div className="oi oi-minus small px-2" />
        </button>
      </div>
    ));

    return (
      <div className="CustomCourse modal fade" id={this.props.id} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                커스텀 과목 추가
              </h5>
            </div>
            <div className="modal-body">
              <table className="table">
                <tbody>
                  <tr>
                    <td>과목명</td>
                    <td>
                      <input
                        className="title form-control"
                        value={this.state.title}
                        onChange={(event) => { this.setState({ title: event.target.value }); }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>시간</td>
                    <td>
                      {segments}
                      <button
                        className="w-100 btn btn-simple my-2"
                        id="append-time-button"
                        type="button"
                        onClick={() => this.appendTime()}
                      >
                        <div className="oi oi-plus small px-2" />
                      추가
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>색상</td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          id="dropdown-color"
                          data-toggle="dropdown"
                          aria-labelledby="Dropdown Color"
                          style={{ backgroundColor: this.state.color }}
                        />
                        <div className="dropdown-menu">
                          <TwitterPicker
                            color={this.state.color}
                            onChangeComplete={(color) => { this.setState({ color: color.hex }); }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-dark close-button"
                onClick={() => this.resetState()}
                data-dismiss="modal"
              >
취소
              </button>
              <button
                type="button"
                className="btn btn-dark post-button"
                data-dismiss="modal"
                onClick={() => this.postCustom(this.state.title, this.state.color, this.state.time)}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  onPostCustomCourse: (timetableId, course) => dispatch(
    actionCreators.postCustomCourse(timetableId, course),
  ),
});

CustomCourse.defaultProps = {
  id: 'custom-course',
  timetableId: 0,
};

CustomCourse.propTypes = {
  id: PropTypes.string,
  timetableId: PropTypes.number,
  onPostCustomCourse: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomCourse);
