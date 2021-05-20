import React from "react";

export default class Time extends React.Component {
  constructor(id, date, time, isStartPunch) {
    super();
    this.id = id;
    this.date = date;
    this.time = time;
    this.isStartPunch = isStartPunch;
    this.hasStop = false;
  }

  getClass() {
    if (this.isStartPunch === 2) {
      return "midPunch";
    }
    if (this.isStartPunch) {
      return "startPunch";
    }
    return "endPunch";
  }
  getText() {
    if (this.isStartPunch === 2) {
      return "";
    }
    if (this.isStartPunch) {
      return "IN :";
    }
    return " : OUT";
  }
  render() {
    return null;
  }
}
