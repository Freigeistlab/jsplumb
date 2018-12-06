const Component_Types = Object.freeze({"INPUT":1, "INTERMEDIATE":2, "OUTPUT":3})


class Window extends React.Component {

  render() {

    const { type, id } = this.props;

    return (
      <div
        className={"bigwindow window component jtk-node " + type }
        id={id}>
        {
          this.props.children
        }
      </div>);
  }
}

class ScaleComponent extends React.Component {

  render() {
    const { id } = this.props;

    return (
      <Window type={Component_Types.INPUT} id={id}>
        <div style={{float: "left"}}><strong >Scale</strong></div>
        <div style={{float: "left"}}>Threshold: <input type="text" style={{width:"30px"}}/></div>
      </Window>
    );
  }
}


class LightpadComponent extends React.Component {

  render() {
    const { id } = this.props;

    return (
      <Window type={Component_Types.INPUT} id={id}>
        <div style={{float: "left"}}><strong >Lightpad</strong></div>
        <div style={{float: "left"}}>Threshold: <input type="text" style={{width:"30px"}}/></div>
      </Window>
    );
  }
}

