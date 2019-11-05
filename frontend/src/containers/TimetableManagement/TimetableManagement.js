import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import TopBar from '../../components/TopBar/TopBar';
import TimetableRecommend from '../TimetableRecommend/TimetableRecommend';

class TimetableManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  statePopup(value) {
    this.setState((prevState) => ({ ...prevState, showPopup: value }));
  }

  handleLogout() {
    this.props.onLogout();
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }
    const recommendresult1 = [
      {
        week_day: 0,
        start_time: 660,
        end_time: 750,
        course_name: '자료구조',
        color: '#2BC366',
        course_number: 'M1522.000900',
        lecture_number: '001',
      },
      {
        week_day: 2,
        start_time: 660,
        end_time: 750,
        course_name: '자료구조',
        color: '#2BC366',
        course_number: 'M1522.000900',
        lecture_number: '001',
      },
      {
        week_day: 4,
        start_time: 840,
        end_time: 960,
        course_name: '자료구조',
        color: '#2BC366',
        course_number: 'M1522.000900',
        lecture_number: '001',
      },
      {
        week_day: 0,
        start_time: 840,
        end_time: 930,
        course_name: '전기전자회로',
        color: '#7FFF00',
        course_number: '4190.206A',
        lecture_number: '001',
      },
      {
        week_day: 2,
        start_time: 840,
        end_time: 930,
        course_name: '전기전자회로',
        color: '#7FFF00',
        course_number: '4190.206A',
        lecture_number: '001',
      },
      {
        week_day: 0,
        start_time: 930,
        end_time: 1020,
        course_name: '컴퓨터구조',
        color: '#FFD700',
        course_number: '4190.308',
        lecture_number: '002',
      },
      {
        week_day: 2,
        start_time: 930,
        end_time: 1020,
        course_name: '컴퓨터구조',
        color: '#FFD700',
        course_number: '4190.308',
        lecture_number: '002',
      },
      {
        week_day: 1,
        start_time: 930,
        end_time: 990,
        course_name: '프로그래밍의원리',
        color: '#866BC3',
        course_number: '4190.210',
        lecture_number: '001',
      },
      {
        week_day: 3,
        start_time: 930,
        end_time: 990,
        course_name: '프로그래밍의원리',
        color: '#866BC3',
        course_number: '4190.210',
        lecture_number: '001',
      },
      {
        week_day: 1,
        start_time: 1110,
        end_time: 1230,
        course_name: '프로그래밍의원리',
        color: '#866BC3',
        course_number: '4190.210',
        lecture_number: '001',
      },
      {
        week_day: 2,
        start_time: 780,
        end_time: 840,
        course_name: '컴퓨터공학세미나',
        color: '#00C3F2',
        course_number: '4190.209',
        lecture_number: '001',
      },
      {
        week_day: 0,
        start_time: 1020,
        end_time: 1110,
        course_name: '소프트웨어 개발의 원리와 실습',
        color: '#FF2312',
        course_number: 'M1522.002400',
        lecture_number: '001',
      },
      {
        week_day: 2,
        start_time: 1020,
        end_time: 1110,
        course_name: '소프트웨어 개발의 원리와 실습',
        color: '#FF2312',
        course_number: 'M1522.002400',
        lecture_number: '001',
      },
      {
        week_day: 3,
        start_time: 1110,
        end_time: 1230,
        course_name: '소프트웨어 개발의 원리와 실습',
        color: '#FF2312',
        course_number: 'M1522.002400',
        lecture_number: '001',
      },
    ];
    const recommendresult2 = [
      {
        week_day: 0,
        start_time: 840,
        end_time: 930,
        course_name: '알고리즘',
        color: '#FF0000',
        course_number: '4190.407',
        lecture_number: '001',
      },
      {
        week_day: 2,
        start_time: 840,
        end_time: 930,
        course_name: '알고리즘',
        color: '#FF0000',
        course_number: '4190.407',
        lecture_number: '001',
      },
      {
        week_day: 0,
        start_time: 1020,
        end_time: 1110,
        course_name: '소프트웨어 개발의 원리와 실습',
        color: '#FF2312',
        course_number: 'M1522.002400',
        lecture_number: '001',
      },
      {
        week_day: 2,
        start_time: 1020,
        end_time: 1110,
        course_name: '소프트웨어 개발의 원리와 실습',
        color: '#FF2312',
        course_number: 'M1522.002400',
        lecture_number: '001',
      },
      {
        week_day: 3,
        start_time: 1110,
        end_time: 1230,
        course_name: '소프트웨어 개발의 원리와 실습',
        color: '#FF2312',
        course_number: 'M1522.002400',
        lecture_number: '001',
      },
      {
        week_day: 2,
        start_time: 780,
        end_time: 840,
        course_name: '컴퓨터공학세미나',
        color: '#00C3F2',
        course_number: '4190.209',
        lecture_number: '001',
      },
      {
        week_day: 1,
        start_time: 660,
        end_time: 750,
        course_name: '프로그래밍언어',
        color: '#00FF00',
        course_number: '4190.310',
        lecture_number: '001',
      },
      {
        week_day: 3,
        start_time: 660,
        end_time: 750,
        course_name: '프로그래밍언어',
        color: '#00FF00',
        course_number: '4190.310',
        lecture_number: '001',
      },
      {
        week_day: 1,
        start_time: 1020,
        end_time: 1110,
        course_name: '시스템프로그래밍',
        color: '#FFFF00',
        course_number: 'M1522.000800',
        lecture_number: '001',
      },
      {
        week_day: 3,
        start_time: 1020,
        end_time: 1110,
        course_name: '시스템프로그래밍',
        color: '#FFFF00',
        course_number: 'M1522.000800',
        lecture_number: '001',
      },
      {
        week_day: 1,
        start_time: 1110,
        end_time: 1230,
        course_name: '시스템프로그래밍',
        color: '#FFFF00',
        course_number: 'M1522.000800',
        lecture_number: '001',
      },
    ];
    const recommendlist = [recommendresult1, recommendresult2];
    const courses = [];
    return (
      <div className="Manage">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <select id="semester-select">
          <option value="2019-1">2019-1</option>
          <option value="2019-s">2019-s</option>
          <option value="2019-2">2019-2</option>
          <option value="2019-w">2019-w</option>
        </select>
        <label htmlFor="courses">
          과목명
          <input id="courses" type="text" />
        </label>
        <ol>
          <li><button type="button">소프트웨어 개발의 원리와 실습</button></li>
          <li><button type="button">전기전자회로</button></li>
          <li><button type="button">인터넷 보안과 프라이버시</button></li>
        </ol>
        <TimetableView id="timetable-table" height={24} width={80} courses={courses} text link title="" />
        <ol>
          <li><button type="button">Timetable1</button></li>
          <li><button type="button">Timetable2</button></li>
          <li><button type="button">Timetable3</button></li>
        </ol>
        <button type="button" id="delete-button">DELETE</button>
        <button type="button" id="create-button">CREATE</button>
        <button type="button" id="timetable-recommend-button" onClick={() => this.statePopup(true)}>RECOMMEND</button>
        {
          this.state.showPopup
            ? (
              <TimetableRecommend
                timetable={recommendlist}
                closePopup={() => this.statePopup(false)}
              />
            )
            : null
        }
      </div>
    );
  }
}

TimetableManagement.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableManagement);
