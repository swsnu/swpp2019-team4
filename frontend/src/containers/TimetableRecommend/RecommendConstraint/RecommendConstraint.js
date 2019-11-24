import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class RecommendConstraint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credit_min: 15,
      credit_max: 18,
      credit_valid: true,
      days_per_week: 5,
      days_per_week_valid: true,
    };
  }

  handleDaysPerWeek(value) {
    const valid = (value <= 6 && value >= 1);
    this.setState({ days_per_week: value, days_per_week_valid: valid });
    this.props.handleValid(this.state.credit_valid && valid);
  }

  handleCreditMin(value) {
    const minValue = Number(value);
    const maxValue = this.state.credit_max;
    const valid = (minValue >= 1 && minValue <= 21 && maxValue >= 1 && maxValue <= 21 && minValue <= maxValue);
    this.setState({ credit_min: value, credit_valid: valid });
    this.props.handleValid(this.state.days_per_week_valid && valid);
  }

  handleCreditMax(value) {
    const minValue = this.state.credit_min;
    const maxValue = Number(value);
    const valid = (minValue >= 1 && minValue <= 21 && maxValue >= 1 && maxValue <= 21 && minValue <= maxValue);
    this.setState({ credit_max: maxValue, credit_valid: valid });
    this.props.handleValid(this.state.days_per_week_valid && valid);
  }

  render() {
    return (
      <div className="RecommendConstraint h-100 d-flex flex-column justify-content-center">
        <div className="form-group row mx-0 my-2">
          <label htmlFor="days-range-input" className="col-2 offset-2 text-right col-form-label"><b>주 N회</b></label>
          <div className="col-4">
            <input
              type="number"
              className={`form-control ${this.state.days_per_week_valid ? 'is-valid' : 'is-invalid'}`}
              id="days-range-input"
              value={this.state.days_per_week}
              onChange={(event) => this.handleDaysPerWeek(event.target.value)}
            />
          </div>
        </div>
        <div className="form-group row mx-0 my-2">
          <label className="col-2 offset-2 text-right col-form-label" htmlFor="credit-min-input"><b>학점 범위</b></label>
          <div className="col-2">
            <input
              type="number"
              className={`form-control ${this.state.credit_valid ? 'is-valid' : 'is-invalid'}`}
              id="credit-min-input"
              value={this.state.credit_min}
              onChange={(event) => this.handleCreditMin(event.target.value)}
            />
          </div>
          <div className="col-2">
            <input
              type="number"
              className={`form-control ${this.state.credit_valid ? 'is-valid' : 'is-invalid'}`}
              id="credit-max-input"
              value={this.state.credit_max}
              onChange={(event) => this.handleCreditMax(event.target.value)}
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

export default connect(null, null)(RecommendConstraint);
