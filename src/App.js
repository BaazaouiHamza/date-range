import React from 'react';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import Moment from 'moment';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: "startDate",
      items: [],
      isLoaded: false,
      error : "",
      currentDate: Moment(),
    };
    this.changeDate.bind(this);
    this.setDateRange.bind(this);
    this.isOutsideRange.bind(this);
    this.onFocusChange.bind(this);
    this.onPrevMonths.bind(this);
    this.onNextMonths.bind(this);
    Moment.locale('fr');
  }
  changeDate({ startDateNew, endDateNew }) {
    if(startDateNew){
      if(this.isDayHighlighted(startDateNew)){
        return false;
      }
    }
    if(endDateNew){
      if(this.isDayHighlighted(endDateNew)){
        return false;
      }
    }
    const { startDate, endDate } = this.state;
    if (startDate && endDate) {
      this.reset();
      this.setState({ startDate: startDateNew, endDate: null, focusedInput: "endDate" })
    } else {
      this.setState({ startDate: startDateNew, endDate: endDateNew });
    }
    try {
      this.props.config.setDateRange(startDateNew, endDateNew);
    } catch (e) {
      console.log(e);
    }
  }
  setDateRange() {
    const { startDate, endDate } = this.state;
    try {
      if (startDate && endDate) {
        this.props.config.onSetDateRange(startDate, endDate);
      } else {
        this.props.config.onSetDateRangeFailed("please select date range!");
      }
    } catch (e) {
      console.log(e);
    }
  }
  isOutsideRange(day) {
    let { startDate, endDate } = this.state;
    
    if (Moment().startOf("day") > day.startOf("day")) {
      return true;
    }
    if (startDate && !endDate) {
      const closest = this.findClosestDate(startDate);
      return closest ? day.isAfter(closest) : closest;
    } else {
      return false;
    }
  }
  findClosestDate(date) {
    const { items } = this.state;
    let closest = date;
    items.forEach(element => {
      const start = element.start;
      const startDate = Moment(start, "YYYY-MM-DD HH:mm:ss");
      if (startDate.startOf("day").format() == date.startOf("day").format()) {
        closest = startDate;
      } else if (startDate.isAfter(date) && startDate.isBefore(closest)) {
        closest = startDate;
      } else if (startDate.isAfter(date) && closest == date) {
        closest = startDate;
      }
      
    });
    return (date == closest) ? false : closest;
  }
  isDayHighlighted(day) {
    let { items } = this.state;
    let reservedDay = false;
    if (items) {
      items.forEach(element => {
        const start = element.start;
        const end = element.end;
        const startDate = Moment(start, "YYYY-MM-DD HH:mm:ss");
        const endDate = Moment(end, "YYYY-MM-DD HH:mm:ss");
        if (this.isDayReserved(day, startDate, endDate)) {
          reservedDay = true;
        }
      });
    }
    return reservedDay;
  }
  isDayReserved(day, startDate, endDate) {
    return day.isBetween(startDate, endDate, null, '[]');
  }
  reset() {
    this.setState({ startDate: null, endDate: null, focusedInput: "startDate" })
  }
  onFocusChange(focusedInput) {
    this.setState({ focusedInput: focusedInput || "startDate" })
  }

  componentDidMount() {
    console.log("componentDidMount");
    this.loadItems();
  }
  loadItems(currentDateSet){
    const { config } = this.props;
    const { url } = config;
    let {currentDate} = this.state;
    currentDateSet = currentDateSet || currentDate;
    console.log("currentDate :::", currentDateSet, currentDateSet.format("YYYY-M"));

    const firstDate = currentDateSet.startOf("month").format("YYYY-MM-DD");
    const lastDate = currentDateSet.add(2, "months").startOf("month").format("YYYY-MM-DD");
    this.setState({
      isLoaded: false,
    });
    fetch(`${url}?start=${firstDate}&end=${lastDate}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  onNextMonths(currentDate){
    this.loadItems(currentDate);
  }
  onPrevMonths(currentDate){
    this.loadItems(currentDate);
  }
  render() {
    const { startDate, endDate, focusedInput, isLoaded, items } = this.state;
    const { config } = this.props;
    const { buttonSetDateRange, buttonClear } = config;
    return <div className={"container-date-range"}>
      {isLoaded}
      <DateRangePicker
        disabled={!isLoaded}
        startDateId={"field-start-id"}
        endDateId={"field-end-id"}
        startDate={startDate}
        endDate={endDate}
        onDatesChange={({ startDate, endDate }) => this.changeDate({ startDateNew: startDate, endDateNew: endDate })}
        focusedInput={focusedInput}
        onFocusChange={focusedInput => this.onFocusChange(focusedInput)}
        numberOfMonths={3}
        isDayHighlighted={(day) => this.isDayHighlighted(day)}
        isOutsideRange={(day) => this.isOutsideRange(day)}
        isDayBlocked={(day)=>this.isDayHighlighted(day)}
        minimumNights={0}
        enableOutsideDays={false}
        onPrevMonthClick={(currentDate) => this.onNextMonths(currentDate)}
        onNextMonthClick={(currentDate) => this.onPrevMonths(currentDate)}
      />
      {buttonSetDateRange && <button onClick={() => this.setDateRange()}>Set date range</button>}
      {buttonClear && <button onClick={() => this.reset()}>Reset</button>}
    </div>
  }
}