import React from 'react';
import './TimeTableView.css';
/*
 * INPUT: props.timetable parsed as [{"week_day": 0, "start_time": 660, "end_time": 750, "course_name": "NAME OF EACH COURSE", "color": "#FFFFFF"}, {}, ...]
 * week_day is 0~5 integer. Monday is 0, Tuesday is 1, ... Saturday is 5
 * start_time, end_time are 660~1230 integer. This value is hour*60+minute (8:00~20:30). start_time must be divided by 30
 * color is 6 hexadigit number.
*/
const TimeTableView=(props)=>{
    var table_header_string=["","M","T","W","T","F","S"];
    var courses_list=[[],[],[],[],[],[]];
    var tablehtml=[];
    var tablehtml_ith=[];
    var heightunit=24;
    var widthunit=100;
    for(let i=0;i<26;i++){
        for(let j=0;j<6;j++){
            courses_list[j].push([]);
        }
    }
    for(let i=0; i<props.courses.length; i++){
        courses_list[props.courses[i]["week_day"]][props.courses[i]["start_time"]/30-16].push({"name":props.courses[i]["course_name"],"length":props.courses[i]["end_time"]-props.courses[i]["start_time"],"color":props.courses[i]["color"]});
    }
    for(let i=0;i<6;i++){
        tablehtml_ith.push(<th key={i} height={heightunit} width={widthunit}>{table_header_string[i]}</th>)
    }
    tablehtml.push(<tr key={-1}>{tablehtml_ith}</tr>);
    for(let i=0;i<26;i++){
        tablehtml_ith=[];
        if(i%2==0)tablehtml_ith.push(<td key={1000*i+1000} height={2*heightunit} width={widthunit} rowSpan={2}>{(i/2+8)+":00"}</td>)
        for(let j=0;j<5;j++){
            if(courses_list[j][i].length==0){
                tablehtml_ith.push(<td key={1000*i+j+1001} height={heightunit} width={widthunit}/>)
            }
            else{
                tablehtml_ith.push(<td key={1000*i+j} height={heightunit} width={widthunit}><div className="square" style={{height: (heightunit*courses_list[j][i][0]["length"]/30)*1.1+"px", width: widthunit+"px", backgroundColor: courses_list[j][i][0]["color"]}}>{courses_list[j][i][0]["name"]}</div></td>)
            }
        }
        tablehtml.push(<tr key={-i-2}>{tablehtml_ith}</tr>);
    }
    return (
        <div className='Timetableview'>
            <table id="timetable" border="1" bordercolor="black" style={{alignItem:"top"}}>
                <caption>TIMETABLE</caption>
                <tbody>
                    {tablehtml}
                </tbody>
            </table>
        </div>
    );
};

export default TimeTableView;