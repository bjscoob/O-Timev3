import React from "react";
import "./styles.css";
import ReactDOM from "react-dom";
import Select from "react-select";
import DayCard from "./daycard.js";
import Punch from "./punch";
import Time from "./time";
import Popup from "./popup";
import { isMobileOnly, isTablet } from "react-device-detect";

/*If a punch starts before any other times, 
it cannot be ended after any other times, and contains  a stop. */
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.doubleWeek = true;
    this.dayRefs = [];
    this.dayCards = [];
    this.times = [];
    const a = new Punch("1", "04/09/2021 09:00", "04/09/2021 17:00");
    const b = new Punch("2", "04/10/2021 18:00", "04/11/2021 02:00");
    const c = new Punch("3", "04/11/2021 13:00", "04/11/2021 22:00");
    const d = new Punch("4", "04/12/2021 09:00", "04/12/2021 17:00");
    const e = new Punch("5", "04/13/2021 18:00", "04/13/2021 22:00");
    const f = new Punch("6", "04/16/2021 13:00", "04/16/2021 22:00");
    const g = new Punch("7", "04/17/2021 09:00", "04/17/2021 17:00");
    const h = new Punch("8", "04/18/2021 12:00", "04/18/2021 16:00");
    const x = new Punch("9", "04/19/2021 13:00", "04/19/2021 22:00");
    const y = new Punch("10", "04/20/2021 05:00", "04/20/2021 08:00");
    const z = new Punch("11", "04/20/2021 09:00", "null");
    var punches = [a, b, c, d, e, f, g, h, x, y, z];
    punches.forEach((punch) => this.addToTimes(punch));
    this.state = {
      text: "",
      classNames: "",
      animationFinished: false,
      payRate: 80.0,
      hourCutoff: 65.0,
      showPopup: false,
      popDay: "",
      popData: [],
      totalHours: 0.0
    };
    this.hours = this.state.totalHours;
    this.overtimeHours = 0.0;
    //default cardwidth should be 160. If anything else its for testing
    this.cardWidth = "160";
    if (isMobileOnly) {
      this.cardWidth = "40";
    }
    if (isTablet) {
      this.cardWidth = "80";
    }
  }
  getInitData() {}
  pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  getBaseHours() {
    if (this.state.totalHours > this.state.hourCutoff) {
      this.overtimeHours = this.state.totalHours - this.state.hourCutoff;
      return this.state.hourCutoff;
    }
    return this.hours;
  }
  addToHours(h) {
    this.setState((prevState) => ({
      totalHours: prevState.totalHours + h
    }));
  }
  addToTimes(punch) {
    var sPunch = new Time(punch.id, punch.startDate, punch.startTime, true);

    if (punch.end !== "null") {
      this.times.push(sPunch);
      this.times.push(new Time(punch.id, punch.endDate, punch.endTime, false));
      return;
    }

    sPunch.hasStop = false;
    this.times.push(sPunch);
  }

  openPopup(day, times) {
    var timeArr = times;
    var popDay = [day];
    this.setState({
      showPopup: !this.state.showPopup,
      popDay: popDay,
      popData: timeArr
    });
  }
  closePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  render() {
    this.baseHours = this.getBaseHours();
    var dayRefs = [];
    var weekOne = [];
    var weekTwo = [];
    var dates = [
      "04/08",
      "04/09",
      "04/10",
      "04/11",
      "04/12",
      "04/13",
      "04/14",
      "04/15",
      "04/16",
      "04/17",
      "04/18",
      "04/19",
      "04/20",
      "04/21"
    ];
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames = dayNames.concat(dayNames);

    //first week
    var weekArr = weekOne;
    var len = 7;
    if (this.doubleWeek) {
      weekArr = weekArr.concat(weekTwo);
      len = 14;
    }
    for (var i = 0; i < len; i++) {
      var stop = false;
      var moda = dates[i].toString();
      if (moda == this.times[this.times.length - 1].date) {
        stop = true;
      }
      weekArr.push(
        <DayCard
          cardWidth={this.cardWidth}
          payRate={this.state.payRate}
          moda={moda}
          day={dayNames[i]}
          elapsedTime="0.0"
          times={this.times.filter((time) => time.date === dates[i])}
          stop={stop}
          popUpFn={this.openPopup.bind(this)}
          addHrsFn={this.addToHours.bind(this)}
        />
      );
    }
    weekOne = weekArr.slice(0, 7);
    dayRefs = (
      <div className="weekView">
        <div class="week">{weekOne}</div>
      </div>
    );
    //second week
    if (this.doubleWeek) {
      weekTwo = weekArr.slice(7, 14);
      dayRefs = (
        <div className="weekView">
          <div class="week">{weekOne}</div>
          <div class="week2">{weekTwo}</div>
        </div>
      );
    }
    this.dayRefs = dayRefs;

    return (
      <div className="App">
        {this.state.showPopup ? (
          <Popup
            day={this.state.popDay}
            data={this.state.popData}
            closePopup={this.closePopup.bind(this)}
          />
        ) : null}
        <img
          src="https://static.thenounproject.com/png/3107464-200.png"
          id="otime_icon"
          alt="otime_icon"
        />
        <h1 id="welcome_banner">Welcome Back</h1>
        <h2 id="name_label">Brandon Jackson</h2>
        <Select
          id="sbSearch"
          styles={this.customStyles}
          options={this.options}
          value="job"
          name="job"
          placeholder="Choose Job..."
        />
        <br />

        {this.dayRefs}
        <h4>PayRate: ${this.state.payRate.toFixed(2)}</h4>
        <div id="leftSect">
          <h3>Base Time: </h3>
          <p className="timelabel1">{this.baseHours.toFixed(2) + " hours "}</p>
          <br />
          <br />
          <h3>Over Time: </h3>
          <p className="timelabel2">
            {this.pad(this.overtimeHours.toFixed(2), 5) + " hours "}
          </p>
          <br />
          <hr class="leftHr" />
          <br />
          <h3>Total Time: </h3>
          <p className="timelabel3">
            {this.state.totalHours.toFixed(2) + " hours "}
          </p>
        </div>
        <div id="rightSect">
          <h3>Base Pay: </h3>
          <p className="payLabel1">
            {"$" + (this.state.totalHours * this.state.payRate).toFixed(2)}
          </p>
          <br />
          <br />
          <h3>O-time Pay: </h3>
          <p className="payLabel2">
            {"$" + (this.state.totalHours * this.state.payRate).toFixed(2)}
          </p>
          <br />
          <hr class="rightHr" />
          <br />
          <h3>Total Pay: </h3>
          <p className="payLabel3">
            {"$" + (this.state.totalHours * this.state.payRate).toFixed(2)}
          </p>
        </div>
      </div>
    );
  }
  componentDidMount() {}
}
ReactDOM.render(<App />, document.getElementById("root"));
