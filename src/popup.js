import React from "react";
import ReactDOM from "react-dom";
import Time from "./time.js";
//color scheme https://colorpalettes.net/color-palette-4013/

export default class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      punchBtn: "punchIn",
      punchText: "PUNCH IN",
      breakBtn: "break",
      breakText: "START BREAK",
      times: [],
      delActive: false,
      delBtn: "delBtnDis",
      punchId: -1,
      punchTime: ""
    };
    this.inputLen = 0;
  }

  toggleOn(e) {
    setTimeout(
      function () {
        //Start the timer
        var id = e.target.id.split("|")[1];
        var time = e.target.id.split("|")[0];
        e.target.placeholder = id;
        e.target.placeholder = "";
        this.setState({
          delActive: false,
          delBtn: "delBtnAbl",
          punchId: id,
          punchTime: time
        });
      }.bind(this),
      150
    );
  }
  toggleOff(e) {
    setTimeout(
      function () {
        //Start the timer
        var id = e.target.id.split("|")[0];
        e.target.placeholder = id;
        this.setState({
          delActive: true,
          delBtn: "delBtnDis",
          punchId: -1,
          punchTime: ""
        });
      }.bind(this),
      100
    );
  }
  delPunch() {
    console.log(this.state.punchId + " : " + this.state.punchTime);
  }
  is_numeric(c) {
    if (c >= "0" && c <= "9") {
      return true;
    } else {
      return false;
    }
  }
  updText(e) {
    var inputText = e.target.value;
    //test the string for numeric
    var lastChar = inputText[inputText.length - 1];
    if (!this.is_numeric(lastChar) && !(lastChar === ":")) {
      e.target.value = inputText.toString().substring(0, inputText.length - 1);
      return;
    }
    if (inputText.length == 2 && this.inputLen != 3) {
      this.inputLen = 3;
      e.target.value = inputText + ":";
    }
    if (inputText.length == 3 && this.inputLen == 4) {
      this.inputLen = 2;
      e.target.value = inputText.toString().substring(0, 2);
    }
    if (inputText.length == 3 && this.is_numeric(lastChar)) {
      e.target.value = inputText.toString().substring(0, 2) + ":" + lastChar;
    }
    this.inputLen = e.target.value.length;
  }
  render() {
    return (
      <div className="popup">
        <div className="popup_inner">
          <button className="closeBtn" onClick={this.props.closePopup}>
            x
          </button>
          <h1 id="popBanner">{this.props.day}</h1>
          <button class={this.state.punchBtn}>{this.state.punchText}</button>
          <button class={this.state.breakBtn}>{this.state.breakText}</button>
          <button
            class={this.state.delBtn}
            disabled={this.state.delActive}
            onClick={this.delPunch.bind(this)}
          >
            DELETE PUNCH
          </button>
          <div>
            <ul id="popTimes">
              {this.props.data.map((t) => (
                <li>
                  {t.getClass() == "startPunch" && (
                    <label class={t.getClass()}>{t.getText()}</label>
                  )}
                  <input
                    class={t.getClass()}
                    type="text"
                    maxLength="5"
                    id={t.time + "|" + t.id}
                    placeholder={t.time}
                    onFocus={this.toggleOn.bind(this)}
                    onBlur={this.toggleOff.bind(this)}
                    onChange={this.updText.bind(this)}
                  />
                  {t.getClass() == "endPunch" && (
                    <label class={t.getClass()}>{t.getText()}</label>
                  )}
                  <hr class={t.getClass()} />
                  <br />
                </li>
              ))}
            </ul>
          </div>
          <button class="savePopBtn">SAVE</button>
        </div>
      </div>
    );
  }
}
