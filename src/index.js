import React from "react";
import "./styles.css";
import ReactDOM from "react-dom";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      classNames: "",
      animationFinished: false
    };
    this.q_label = "test";
    this.count = 0;
  }
  onAnimationStart = () => {
    this.setState({
      animationFinished: false
    });
  };
  onAnimationEnd = () => {
    this.setState({
      animationFinished: true
    });
  };

  handleClick = () => {
    this.setState((prevState) => {
      this.q_label = this.count;
      return {
        count: (this.count += 1)
      };
    });
  };
  render() {
    return (
      <div>
        <div className="App">
          <h1>O-time</h1>
          <h2 className="q_label">{this.q_label} </h2>
          <button className="nextBtn" onClick={this.handleClick}>
            Next
          </button>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
