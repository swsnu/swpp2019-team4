import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import * as actionCreators from '../../store/actions/index';
import './CourseDetail.css';

class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  toggle() {
    this.setState((prevState) => ({ ...prevState, isOpen: !prevState.isOpen }));
  }

  render() {
    return (
      <div className="CourseDetail modal fade" id={this.props.id} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {this.props.title}
              </h5>
            </div>
            <div className="modal-body">
              <a href={this.props.href}>COURSE LINK</a>
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
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetail);
