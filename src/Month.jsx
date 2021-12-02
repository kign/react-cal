import React from "react";

class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {today: Month.today()};
  }

  static today () {
    const now = new Date();
    return {year : now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  static cmp(d1, d2) {
    if (d1.year > d2.year)
      return 1;
    else if (d1.year < d2.year)
      return -1;
    else if (d1.month > d2.month)
      return 1;
    else if (d1.month < d2.month)
      return -1;
    else if (d1.day > d2.day)
      return 1;
    else if (d1.day < d2.day)
      return -1;
    else
      return 0;
  }

  static make_key(date) {
    return date.year + ('00' + date.month).slice(-2) + ('00' + date.day).slice(-2);
  }

  date(d) {
    let [y, m] = [this.props.cal.year, this.props.cal.month + d[0]];
    if (m > 12) {
      m -= 12;
      y ++;
    }
    if (m < 1) {
      m += 12;
      y --;
    }
    return {year: y, month: m, day: d[1]};
  }

  first_date () {
    return new Date(this.props.cal.year, this.props.cal.month - 1, 1);
  }

  * number_grid () {
    const firstDayOfTheMonth = this.first_date();
    const day = this.first_date();
    day.setDate(1 - firstDayOfTheMonth.getDay());
    let a = -1;
    while(a < 1) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const [y,m,d] = [day.getFullYear(), day.getMonth(), day.getDate()];
        a = 12 * y + m - 12*this.props.cal.year - this.props.cal.month + 1;
        week.push([a, d]);
        day.setDate(d + 1);
      }
      yield week;
    }
  }

  day_style(x, day) {
    if (x === 0) {// 'today'
      const a = 12 * this.state.today.year + this.state.today.month - 12 * this.props.cal.year - this.props.cal.month;
      return day[0] === a && day[1] === this.state.today.day;
    }
    else if (x === 1) {// 'selected'
      const a = 12 * this.props.sel.year + this.props.sel.month - 12 * this.props.cal.year - this.props.cal.month;
      return day[0] === a && day[1] === this.props.sel.day;
    }
    else if (x === 2) // 'other'
      return day[0] !== 0;
    else if (x === 3) {// 'past'
      const date = this.date(day);
      const key = Month.make_key(date);
      return 0 > Month.cmp(date, this.state.today) && this.props.totals[key] && this.props.totals[key][1];
    }
    else if (x === 4) {// 'future'
      const date = this.date(day);
      const key = Month.make_key(date);
      return 0 < Month.cmp(date, this.state.today) && this.props.totals[key] && this.props.totals[key][0];
    }
  }

  click(d) {
    const date = this.date(d);

    if (!Month.cmp(date, this.props.sel))
      return;

    this.props.select(date);

    if (d[0] !== 0)
      this.props.scroll(d[0]);
  }

  render () {
    return <td style={{verticalAlign: 'top'}}>
      <table style={{width: "100%"}}>
        <tbody>
        <tr>
          <td align="left"><span onClick={() => this.props.scroll(-1)}>&larr;</span></td>
          <td align="center">{this.props.cal.year} - {this.first_date().toLocaleString('default', { month: 'long' })}</td>
          <td align="right"><span onClick={() => this.props.scroll(1)}>&rarr;</span></td>
        </tr>
        </tbody>
      </table>
      <table style={{width: "100%"}}>
        <thead>
        <tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>
        </thead>
        <tbody>
        {[...this.number_grid()].map((w, wkidx) =>
          <tr key={wkidx}>
            {w.map((d, dayidx) =>
              <td key={dayidx} onClick={() => this.click(d)} style={{textAlign: "center"}} className={[[0, "today"], [1, "selected"], [2, "other"], [3, "past"], [4, "future"]].filter(x => this.day_style(x[0], d)).map(x => x[1]).join(" ")}>{d[1]}</td>)}
          </tr>)}
        </tbody>
      </table>
    </td>
  }
}

export default Month;