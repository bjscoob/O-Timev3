import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import Time from "./time.js";
import App from "./index.js";
import ButtonBase from "@material-ui/core/ButtonBase";

export default class DayCard extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      payRate: this.props.payRate,
      day: this.props.day,
      punches: this.props.times
    };
    //diff(
    //moment(this.firstPunch, "MM/DD/YYYY HH:mm:ss")
    this.elapsedTime = 0;
    this.times = [];
    this.state.hours1 = moment.duration(this.state.ms).asHours().toFixed(2);
    this.getTotalTime();
  }
  calculateTime(startDate, startTime, endDate, endTime) {
    var sDateArr = startDate.split("/");
    var sTimeArr = startTime.split(":");
    var eDateArr = endDate.split("/");
    var eTimeArr = endTime.split(":");

    var d1 = new Date(
      "2021",
      sDateArr[0],
      sDateArr[1],
      sTimeArr[0],
      sTimeArr[1]
    );
    var d2 = new Date(
      "2021",
      eDateArr[0],
      eDateArr[1],
      eTimeArr[0],
      eTimeArr[1]
    );
    const diffInMs = Math.abs(d2 - d1);
    return (diffInMs / (1000 * 60 * 60)).toFixed(2);
  }
  getTotalTime() {
    var timeArr = [].concat(this.props.times);
    var totalTime = 0.0;
    if (!timeArr.length) {
      return totalTime;
    }
    //check if first element is an end punch, if so insert 00:00 in front
    if (!timeArr[0].isStartPunch) {
      var firstTime = new Time(-1, this.props.moda, "00:00", 2);
      timeArr = [firstTime].concat(timeArr);
    }
    //check if last element is start punch, if so insert 24:00 in back
    if (timeArr[timeArr.length - 1].isStartPunch && !this.props.stop) {
      var lastTime = new Time(-1, this.props.moda, "24:00", 2);
      timeArr.push(lastTime);
    }
    for (var i = 0; i < timeArr.length; i += 2) {
      try {
        totalTime += Number(
          this.calculateTime(
            timeArr[i].date,
            timeArr[i].time,
            timeArr[i + 1].date,
            timeArr[i + 1].time
          )
        );
      } catch (e) {
        console.log("Open Punch Day Card: " + this.props.moda);
      }
    }
    this.times = timeArr;
    this.elapsedTime = totalTime;
    this.props.addHrsFn(this.elapsedTime);
  }
  render() {
    var t = this.times;
    const times = t.map((punch) => (
      <Typography>
        <div class={punch.getClass()}>{punch.time}</div>

        <hr class={punch.getClass()} />
      </Typography>
    ));

    let content = <div>{times}</div>;
    return (
      <div>
        <ButtonBase
          onClick={(event) => {
            this.props.popUpFn(this.props.moda, this.times);
          }}
        >
          <Card
            class="card"
            style={{
              backgroundColor: "white",
              padding: 0,
              textAlign: "left",
              borderRadius: 0,
              width: Number(this.props.cardWidth),
              marginRight: 3,
              float: "left"
            }}
          >
            <CardContent
              class="card"
              style={{
                padding: 3
              }}
            >
              <Typography>
                <div class="moda">{this.props.moda}</div>
              </Typography>
              <Typography>
                <div class="dayName">{this.state.day}</div>
              </Typography>
              <Typography>
                <div class="dayHours">{this.elapsedTime + " hrs"}</div>
              </Typography>
              <Typography>
                <hr />
              </Typography>
              {content}
              <Typography>
                <hr />
              </Typography>
              <Typography>
                <div class="dayPay">
                  {"$" +
                    Number(
                      this.state.payRate * Number(this.elapsedTime)
                    ).toFixed(2)}
                </div>
              </Typography>
            </CardContent>
          </Card>
        </ButtonBase>
      </div>
    );
  }
}
