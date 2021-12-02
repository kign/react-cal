import React from "react";

class TODO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {edit: null};
  }

  onKeyUp (event) {
    if (event.keyCode === 13) {
      this.commit(event.target.value);
      if (this.state.edit === null)
        event.target.value = '';
    }
  }

  commit(value) {
    const new_items = [...this.props.items];
    if (this.state.edit !== null) {
      new_items[this.state.edit] = [0, this.inputValue];
      this.setState({edit: null});
    }
    else
      new_items.push([0, value]);
    this.props.update(new_items);
  }

  check(idx) {
    this.props.update(this.props.items.map((x,i) => [i === idx? 1 - x[0] : x[0], x[1]]));
  }

  edit(idx) {
    if (this.state.edit !== idx) {
      if (this.state.edit !== null)
        this.commit('-');
      if (idx !== null)
        this.inputValue = this.props.items[idx][1];
      this.setState({edit: idx});
    }
  }

  input (value, placeholder) {
    return <input onClick={() => {if(placeholder) this.edit(null)}} placeholder={placeholder} onChange={event => this.inputValue = event.target.value} onKeyUp={event => this.onKeyUp(event)} defaultValue={value}/>
  }

  render () {
    return <table>
        <tbody>
        {this.props.items.map((item, idx) =>
          <tr key={idx}>
            <td onClick={() => this.check(idx)} style={item[0]?{color: "green"}:{}}>{item[0] ?'✔': '︎▢'}</td>
            <td>
              {this.state.edit === idx
              ? this.input(item[1], '')
              : <span onClick={() => this.edit(idx)}>{item[1]}</span>}
            </td>
          </tr>)}
          <tr><td>＋</td><td>{this.input('', "New item")}</td></tr>
        </tbody>
      </table>
  }
}

export default TODO;