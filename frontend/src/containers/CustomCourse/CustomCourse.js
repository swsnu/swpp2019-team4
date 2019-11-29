import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import './CustomCourse.css';

class CustomCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      time: '',
      color: '',
    };
  }

  resetState() {
    this.setState({ title: '', time: '', color: '' });
  }

  postCustom(title, color, time) {
    const timeArray = time.split('/');
    const timeDictArray = [];
    for (let i = 0; i < timeArray.length; i += 1) {
      const splittedArray = timeArray[i].split('-');
      timeDictArray.push({
        week_day: splittedArray[0],
        start_time: splittedArray[1],
        end_time: splittedArray[2],
      });
    }
    const course = { title, color, time: timeDictArray };
    this.props.onPostCustomCourse(this.props.timetableId, course);
    this.resetState();
  }

  render() {
    return (
      <div className="CustomCourse modal fade" id={this.props.id} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                새 과목 추가
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
                      <input
                        className="time form-control"
                        value={this.state.time}
                        onChange={(event) => { this.setState({ time: event.target.value }); }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>색상</td>
                    <td>
                      <input
                        className="color form-control"
                        value={this.state.color}
                        onChange={(event) => { this.setState({ color: event.target.value }); }}
                      />
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
