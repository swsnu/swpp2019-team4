import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import * as actionCreators from '../../store/actions/index';
import './CourseDetail.css';

class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const href = 'http://sugang.snu.ac.kr/sugang/cc/cc101.action?'
      + 'openSchyy=2019&openShtmFg=U000200002&openDetaShtmFg='
      + `U000300001&sbjtCd=${this.props.course.course_number}`
      + `&ltNo=${this.props.course.lecture_number}&sugangFlag=P`;

    return (
      <div className="CourseDetail modal fade" id={this.props.id} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {this.props.course.title}
              </h5>
            </div>
            <div className="modal-body">
              <table className="table">
                <tbody>
                  <tr>
                    <td>강좌번호</td>
                    <td>{this.props.course.course_number}</td>
                  </tr>
                  <tr>
                    <td>분반번호</td>
                    <td>{this.props.course.lecture_number}</td>
                  </tr>
                </tbody>
              </table>
              <a href={href} rel="noopener noreferrer" target="_blank">COURSE LINK</a>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-dark" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

CourseDetail.propTypes = {
  id: PropTypes.string.isRequired,
  course: PropTypes.shape({
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    lecture_number: PropTypes.string.isRequired,
    course_number: PropTypes.string.isRequired,
    time: PropTypes.arrayOf(PropTypes.shape({
      start_time: PropTypes.number.isRequired,
      end_time: PropTypes.number.isRequired,
      week_day: PropTypes.number.isRequired,
    })),
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetail);
