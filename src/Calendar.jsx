import React from "react";
import Month from "./Month";
import TODO from "./TODO";

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    const now = new Date();
    const daysTotals = {};
    for (let i = 0; i < localStorage.length; i ++) {
      const key = localStorage.key(i);
      if (/^[0-9]{8}$/.test(key)) {
        const todolist = JSON.parse(localStorage.getItem(key));
        const done = [0, 0];
        for (const item of todolist)
          done[item[0]? 0 : 1] ++;
        daysTotals[key] = [done[0] + done[1] > 0, done[1] > 0];
      }
    }
    const [y,m,d] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    const sel_date = {year: y, month:m, day:d};
    this.state = {cal : {year: y, month: m}, todo: sel_date, todolist: this.retrieve(sel_date), daysTotals: daysTotals};
  }

  update(todolist) {
    const key = Month.make_key(this.state.todo);
    todolist = todolist.filter(x => x[1]);
    localStorage.setItem(key, JSON.stringify(todolist));

    const done = [0, 0];
    for (const item of todolist)
      done[item[0]? 0 : 1] ++;
    const dayTotal = [done[0] + done[1] > 0, done[1] > 0];
    if (!this.state.daysTotals[key] || dayTotal[0] !== this.state.daysTotals[key][0] || dayTotal[1] !== this.state.daysTotals[key][1]) {
      const daysTotals_new = {...this.state.daysTotals};
      daysTotals_new[key] = dayTotal;
      this.setState({daysTotals: daysTotals_new});
    }
    this.setState({todolist: todolist});
  }

  retrieve(date) {
    const json_todo = localStorage.getItem(Month.make_key(date));
    if (json_todo)
      return JSON.parse(json_todo);
    return [];
  }

  scrollMonth(incr) {
    let [m, y] = [this.state.cal.month, this.state.cal.year];
    m += incr;
    while (m > 12) {
      m -= 12;
      y ++;
    }
    while (m < 1) {
      m += 12;
      y --;
    }
    this.setState({cal: {year: y, month: m}});
  }

  show_date (date) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.toLocaleString('default', { month: 'long' }) + " " + date.day + ", " + date.year;
  }

  select(date) {
    this.setState({todo: date, todolist: this.retrieve(date)});
  }

  render() {
    return <table>
      <tbody>
      <tr>
        <Month cal={this.state.cal} sel={this.state.todo} totals={this.state.daysTotals} scroll={incr => this.scrollMonth(incr)} select={date => this.select(date)}/>
        <td style={{width: "10px", borderRight: "solid 1px black"}}>&nbsp;</td>
        <td style={{verticalAlign: 'top'}}>
          <div style={{textAlign: 'center', marginBottom: '5px'}}>  {this.show_date(this.state.todo)}</div>
          <TODO items={this.state.todolist} update={todolist => this.update(todolist)}/>
        </td>
      </tr>
      </tbody>
    </table>
  }
}

export default Calendar;