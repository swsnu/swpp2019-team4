import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './RecommendTime.css';
import * as actionCreators from '../../../store/actions/index';

class RecommendTime extends Component {
  constructor(props) {
    super(props);
    var colorTable = []
    for(var i = 0; i < 26; i++) {
      colorTable.push([3, 3, 3, 3, 3, 3]);
    }
    this.is_mount = false;
    this.state = {
      mouse_down: false,
      color: 0,
      color_table: colorTable,
      prv_table: colorTable,
    };
    this.mouseUpListener = this.mouseUpListener.bind(this);
    this.mouseDownListener = this.mouseDownListener.bind(this);
  }

  componentDidMount() {
    this.is_mount = true;
    this.props.handleValid(true);
    this.props.onGetTimePref()
      .then(() => {
        const color_table = this.props.color_table.slice();
        this.setState({color_table: color_table});
      });
    document.addEventListener('mouseup', this.mouseUpListener, true);
    document.addEventListener('mousedown', this.mouseDownListener, true);
  }

  componentWillUnmount() {
    this.is_mount = false;
    document.removeEventListener('mouseup', this.mouseUpListener, true);
    document.removeEventListener('mousedown', this.mouseDownListener, true);
  }

  mouseDownListener(event) {
    event.preventDefault();
    if (this.is_mount) this.setState({ mouse_down: true });
  }

  mouseUpListener() {
    if (!this.is_mount) return;
    const cur_table = this.state.color_table;
    const prv_table = this.state.prv_table;
    var new_table = []
    var is_same = true;
    for(var i=0;i<26;i++) {
      var tmp_table = []
      for(var j=0;j<6;j++) {
        tmp_table.push(cur_table[i][j]);
        if(cur_table[i][j] !== prv_table[i][j]) {
          is_same = false;
        }
      }
      new_table.push(tmp_table);
    }
    if(!is_same) {
      this.props.onPutTimePref(cur_table);
    }
    this.setState({ prv_table: new_table, mouse_down: false });
  }

  handleColor(index) {
    this.setState({ color: index });
  }

  handleFill(xIndex, yIndex, force) {
    if (this.state.mouse_down || force) {
      this.setState((prevState) => {
        const colorTable = prevState.color_table;
        colorTable[xIndex][yIndex] = prevState.color;
        return ({ ...prevState, color_table: colorTable });
      });
    }
  }

  render() {
    const colorArray = ['#FF4040', '#FF8080', '#FFC0C0', '#FFFFFF'];
    const colorComment = ['싫음', '', '', '좋음'];
    const tableHeaderString = ['', 'M', 'T', 'W', 'T', 'F', 'S'];
    const tablehtml = [];
    const colorhtml = [];
    let tablehtmlIth = [];
    for (let i = 0; i < 7; i += 1) {
      tablehtmlIth.push(<th key={i} height={16}>{tableHeaderString[i]}</th>);
    }
    tablehtml.push(<tr key={-1}>{tablehtmlIth}</tr>);
    for (let i = 0; i < 26; i += 1) {
      tablehtmlIth = [];
      if (i % 2 === 0) {
        tablehtmlIth.push(
          <td
            className="text-right pr-2 py-0 small text-black-50"
            key={1000 * i + 1000}
            rowSpan={2}
          >
            {`${i / 2 + 8}`}
          </td>,
        );
      }
      for (let j = 0; j < 6; j += 1) {
        const color = colorArray[this.state.color_table[i][j]];
        tablehtmlIth.push(
          <td key={1000 * i + j} style={{ backgroundColor: color, cursor: 'crosshair' }}>
            <div
              style={{ height: '15px' }}
              id="table-square"
              role="button"
              tabIndex="-1"
              aria-label={color}
              onMouseDown={() => this.handleFill(i, j, true)}
              onMouseEnter={() => this.handleFill(i, j, false)}
            />
          </td>,
        );
      }
      tablehtml.push(<tr key={-i - 2} height={16}>{tablehtmlIth}</tr>);
    }
    for (let i = colorArray.length - 1; i >= 0; i -= 1) {
      colorhtml.push(
        <tr key={i}>
          <td>
            <div
              className={`my-2 circle ${this.state.color === i ? 'oi oi-check' : ''}`}
              style={{ backgroundColor: colorArray[i] }}
              id="color-circle"
              tabIndex="-1"
              role="button"
              aria-label={colorArray[i]}
              onClick={() => this.handleColor(i)}
              onKeyDown={() => this.handleColor(i)}
            />
          </td>
          <td className="small text-left pl-2"><b>{colorComment[i]}</b></td>
        </tr>,
      );
    }
    return (
      <div className="RecommendTime row m-0">
        <table className="w-100 col-6 offset-2" id="recommend-time-table">
          <colgroup>
            <col span="1" style={{ width: '10%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
          </colgroup>
          <tbody>
            {tablehtml}
          </tbody>
        </table>
        <div className="w-100 col-4 d-flex flex-column justify-content-center">
          <div className="small text-black-50 text-left my-2">
            색상을 선택한 후 칠하세요.
          </div>
          <table id="recommend-color-picker">
            <tbody>
              {colorhtml}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

RecommendTime.propTypes = {
  handleValid: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  color_table: state.user.time_pref_table,
});

const mapDispatchToProps = (dispatch) => ({
  onGetTimePref: () => dispatch(actionCreators.getTimePref()),
  onPutTimePref: (table) => dispatch(actionCreators.putTimePref(table))
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendTime);
