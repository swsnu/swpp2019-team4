import React, { Component } from './node_modules/react';
import { connect } from './node_modules/react-redux';
import { Redirect, NavLink } from './node_modules/react-router-dom';
import * as actionCreators from '../../store/actions/index';

const TimeTableView=(props)=>{//TODO: props.timetable
    var tablestring=[
    ["","M","T","W","T","F","S"],
    ["8:00","","","","","",""],
    ["8:30","","","","","",""],
    ["9:00","","","","","",""],
    ["9:30","","","","","",""],
    ["10:00","","","","","",""],
    ["10:30","","","","","",""],
    ["11:00","","","","","",""],
    ["11:30","","","","","",""],
    ["12:00","","","","","",""],
    ["12:30","","","","","",""],
    ["13:00","","","","","",""],
    ["13:30","","","","","",""],
    ["14:00","","","","","",""],
    ["14:30","","","","","",""],
    ["15:00","","","","","",""],
    ["15:30","","","","","",""],
    ["16:00","","","","","",""],
    ["16:30","","","","","",""],
    ["17:00","","","","","",""],
    ["17:30","","","","","",""],
    ["18:00","","","","","",""],
    ["18:30","","","","","",""],
    ["19:00","","","","","",""],
    ["19:30","","","","","",""],
    ["20:00","","","","","",""],
    ["20:30","","","","","",""],];
    //TODO: fill tablestring
    var tablehtml=tablestring.map(row=><tr><th width="100">{row[0]}</th><td width="100">{row[1]}</td><td width="100">{row[2]}</td><td width="100">{row[3]}</td><td width="100">{row[4]}</td><td width="100">{row[5]}</td><td width="100">{row[6]}</td></tr>)
    return (
        <div className='Timetableview'>
            <table id="timetable" border="1" bordercolor="red" width ="800" height="500">
                <caption>TIMETABLE</caption>
                {tablehtml}
            </table>
        </div>
    );
};

export default TimeTableView;