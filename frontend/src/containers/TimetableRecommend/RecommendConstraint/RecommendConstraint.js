import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actionCreators from '../../../store/actions/index';

class RecommendConstraint extends Component {
  constructor(props) {
    super(props);
    const consts = this.props.constraints;
    this.state = {
      consts: consts,
      credit_min_valid: false,
      credit_max_valid: false,
      credit_valid: false,
      major_min_valid: false,
      major_max_valid: false,
      major_valid: false,
      days_per_week: false,
      days_per_week_valid: false,
    };
  }

  componentDidMount() {
    this.props.onGetConstraints()
      .then(() => {
        const consts = this.props.constraints;
        this.setState({
          consts: consts,
          credit_min_valid: (consts.credit_min >= 1 &&
                            consts.credit_min <= 21),
          credit_max_valid: (consts.credit_max >= 1 &&
                            consts.credit_max <= 21),
          credit_valid: (consts.credit_min <= consts.credit_max),
          major_min_valid: (consts.major_min >= 0 &&
                            consts.major_min <= 21),
          major_max_valid: (consts.major_max >= 0 &&
                            consts.major_max <= 21),
          major_valid: (consts.major_min <= consts.credit_max),
          days_per_week: consts.days_per_week,
          days_per_week_valid: (consts.days_per_week >= 1 &&
                                consts.days_per_week <= 6),
        });
      })
  }

  handleDaysPerWeek(value) {
    const valid = (value <= 6 && value >= 1);
    const newConsts = { ...this.state.consts, days_per_week: value };
    this.setState({ consts: newConsts, days_per_week_valid: valid });
    this.props.handleValid(this.state.credit_valid && this.state.credit_min_valid
      && this.state.credit_max_valid && valid);
    this.props.onPutConstraints(newConsts);
  }

  handleCreditMin(value) {
    const minValue = Number(value);
    const maxValue = this.state.consts.credit_max;
    const minValid = (minValue >= 1 && minValue <= 21);
    const valid = minValue <= maxValue;
    const newConsts = { ...this.state.consts, credit_min: minValue };
    this.setState({ consts: newConsts, credit_valid: valid, credit_min_valid: minValid });
    this.props.handleValid(this.state.days_per_week_valid
                           && valid
                           && minValid
                           && this.state.credit_max_valid
                           && this.state.major_valid
                           && this.state.major_min_valid
                           && this.state.major_max_valid);
    this.props.onPutConstraints(newConsts);
  }

  handleCreditMax(value) {
    const minValue = this.state.consts.credit_min;
    const maxValue = Number(value);
    const maxValid = (maxValue >= 1 && maxValue <= 21);
    const valid = minValue <= maxValue;
    const newConsts = { ...this.state.consts, credit_max: maxValue };
    this.setState({ consts: newConsts, credit_valid: valid, credit_max_valid: maxValid });
    this.props.handleValid(this.state.days_per_week_valid
                           && valid
                           && this.state.credit_min_valid
                           && maxValid
                           && this.state.major_valid
                           && this.state.major_min_valid
                           && this.state.major_max_valid);
    this.props.onPutConstraints(newConsts);
  }

  handleMajorMin(value) {
    const minValue = Number(value);
    const maxValue = this.state.consts.major_max;
    const minValid = (minValue >= 0 && minValue <= 21);
    const valid = minValue <= maxValue && minValue <= this.state.consts.credit_max;
    const newConsts = { ...this.state.consts, major_min: minValue };
    this.setState({ consts: newConsts, major_valid: valid, major_min_valid: minValid });
    this.props.handleValid(this.state.days_per_week_valid
                           && this.state.credit_valid
                           && this.state.credit_min_valid
                           && this.state.credit_max_valid
                           && valid
                           && minValid
                           && this.state.major_max_valid);
    this.props.onPutConstraints(newConsts);
  }

  handleMajorMax(value) {
    const minValue = this.state.consts.major_min;
    const maxValue = Number(value);
    const maxValid = (maxValue >= 0 && maxValue <= 21);
    const valid = minValue <= maxValue && minValue <= this.state.consts.credit_max;
    const newConsts = { ...this.state.consts, major_max: maxValue };
    this.setState({ consts: newConsts, major_valid: valid, major_max_valid: maxValid });
    this.props.handleValid(this.state.days_per_week_valid
                           && this.state.credit_valid
                           && this.state.credit_min_valid
                           && this.state.credit_max_valid
                           && valid
                           && this.state.major_min_valid
                           && maxValid);
    this.props.onPutConstraints(newConsts);
  }

  render() {
    return (
      <div className="RecommendConstraint h-100 d-flex flex-column justify-content-center">
        <div className="form-group row mx-0 my-2">
          <label htmlFor="days-range-input" className="col-4 text-right col-form-label"><b>주 N일제</b></label>
          <div className="col-6">
            <input
              type="number"
              className={`form-control ${this.state.days_per_week_valid ? 'is-valid' : 'is-invalid'}`}
              id="days-range-input"
              value={this.state.consts.days_per_week}
              onChange={(event) => this.handleDaysPerWeek(event.target.value)}
            />
          </div>
        </div>
        <div className="form-group row mx-0 my-2">
          <label className="col-4 text-right col-form-label" htmlFor="credit-min-input"><b>학점 범위</b></label>
          <div className="col-3">
            <input
              type="number"
              className={`form-control ${this.state.credit_valid
                && this.state.credit_min_valid ? 'is-valid' : 'is-invalid'}`}
              id="credit-min-input"
              value={this.state.consts.credit_min}
              onChange={(event) => this.handleCreditMin(event.target.value)}
            />
          </div>
          <div className="col-3">
            <input
              type="number"
              className={`form-control ${this.state.credit_valid
                && this.state.credit_max_valid ? 'is-valid' : 'is-invalid'}`}
              id="credit-max-input"
              value={this.state.consts.credit_max}
              onChange={(event) => this.handleCreditMax(event.target.value)}
            />
          </div>
        </div>
        <div className="form-group row mx-0 my-2">
          <label className="col-4 text-right col-form-label" htmlFor="major-min-input"><b>전공 과목 학점 범위</b></label>
          <div className="col-3">
            <input
              type="number"
              className={`form-control ${this.state.major_valid
                && this.state.major_min_valid ? 'is-valid' : 'is-invalid'}`}
              id="major-min-input"
              value={this.state.consts.major_min}
              onChange={(event) => this.handleMajorMin(event.target.value)}
            />
          </div>
          <div className="col-3">
            <input
              type="number"
              className={`form-control ${this.state.major_valid
                && this.state.major_max_valid ? 'is-valid' : 'is-invalid'}`}
              id="major-max-input"
              value={this.state.consts.major_max}
              onChange={(event) => this.handleMajorMax(event.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

RecommendConstraint.propTypes = {
  handleValid: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  constraints: state.user.constraints,
});

const mapDispatchToProps = (dispatch) => ({
  onPutConstraints: (consts) => dispatch(actionCreators.putConstraints(consts)),
  onGetConstraints: () => dispatch(actionCreators.getConstraints()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendConstraint);
