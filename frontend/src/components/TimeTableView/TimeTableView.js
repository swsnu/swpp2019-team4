import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
/*
 * INPUT: props.timetable parsed as [{"week_day": 0, "start_time_index": 0, "end_time_index": 3, "course_name": "NAME OF EACH COURSE"}, {}, ...]
 * week_day is 0~5 integer. Monday is 0, Tuesday is 1, ... Saturday is 5
 * start_time_index, end_time_index are 16~41 integer. 8:00 is 16, 8:30 is 17, ... 20:30 is 41.
 * If the course time is 8:30~9:30, start_time_index is 17, end_time_index is 19
*/
const TimeTableView=(props)=>{
    var tablestring=[
    ["    ","M","T","W","T","F","S"],
    ["8:00"," "," "," "," "," "," "],
    ["8:00"," "," "," "," "," "," "],
    ["9:00"," "," "," "," "," "," "],
    ["9:00"," "," "," "," "," "," "],
    ["10:00"," "," "," "," "," "," "],
    ["10:00"," "," "," "," "," "," "],
    ["11:00"," "," "," "," "," "," "],
    ["11:00"," "," "," "," "," "," "],
    ["12:00"," "," "," "," "," "," "],
    ["12:00"," "," "," "," "," "," "],
    ["13:00"," "," "," "," "," "," "],
    ["13:00"," "," "," "," "," "," "],
    ["14:00"," "," "," "," "," "," "],
    ["14:00"," "," "," "," "," "," "],
    ["15:00"," "," "," "," "," "," "],
    ["15:00"," "," "," "," "," "," "],
    ["16:00"," "," "," "," "," "," "],
    ["16:00"," "," "," "," "," "," "],
    ["17:00"," "," "," "," "," "," "],
    ["17:00"," "," "," "," "," "," "],
    ["18:00"," "," "," "," "," "," "],
    ["18:00"," "," "," "," "," "," "],
    ["19:00"," "," "," "," "," "," "],
    ["19:00"," "," "," "," "," "," "],
    ["20:00"," "," "," "," "," "," "],
    ["20:00"," "," "," "," "," "," "],];
    for(let i=0; i<props.courses.length; i++){
        var day=props.courses[i]["week_day"]+1;
        for(let j=props.courses[i]["start_time_index"]-15;j<props.courses[i]["end_time_index"]-15;j++){
            tablestring[j][day]=props.courses[i]["course_name"];
        }
    }
    var tablehtml=[];
    var heightunit=20;
    var widthunit=100;
    for(let i=0;i<tablestring.length;i++){
        var tablehtml_ith=[];
        for(let j=0;j<tablestring[i].length;j++){
            if(i>1&&tablestring[i][j]==tablestring[i-1][j])continue;
            var sametext_length=1;
            for(var k=i+1;k<tablestring.length;k++){
                if(tablestring[i][j]===tablestring[k][j])sametext_length++;
                else break;
            }
            if(i!=0||j!=0)tablehtml_ith.push(<td key={1000*i+j} height={heightunit*sametext_length} width={widthunit} rowSpan={sametext_length}>{tablestring[i][j]}</td>)
            else tablehtml_ith.push(<th key={1000*i+j} height={heightunit*sametext_length} width={widthunit} rowSpan={sametext_length}>{tablestring[i][j]}</th>)
        }
        tablehtml.push(<tr key={i}>{tablehtml_ith}</tr>);
    }
    //tablestring.map(row=><tr key={row[0]}><th width="100">{row[0]}</th><td width="100">{row[1]}</td><td width="100">{row[2]}</td><td width="100">{row[3]}</td><td width="100">{row[4]}</td><td width="100">{row[5]}</td><td width="100">{row[6]}</td></tr>)
    return (
        <div className='Timetableview'>
            <table id="timetable" border="1" bordercolor="black" width ="800" height="500">
                <caption>TIMETABLE</caption>
                <tbody>
                    {tablehtml}
                </tbody>
            </table>
        </div>
    );
};

export default TimeTableView;