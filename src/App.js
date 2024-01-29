import React, { useState, useEffect } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "./App.css";
import { CalendarDay, DateRangePicker } from "react-dates";
import Moment from "moment";
import { BlockedTd, CheckTd, Day, HighLightedTd } from "./styled";

const App = (props) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState("startDate");
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(Moment());

  const handleDatesChange = ({ startDate, endDate }) => {
    // Check if the selected range includes any blocked dates
    const isRangeOverBlockedDates = items.some(
      ({ start, end }) =>
        Moment(start).isBetween(startDate, endDate, "D", "[)") ||
        Moment(end).isBetween(startDate, endDate, "D", "(]")
    );

    if (isRangeOverBlockedDates) {
      // Adjust the start and end dates to prevent spanning over blocked dates
      setStartDate(null);
      setEndDate(null);
    } else {
      // No blocked dates in the selected range, set the dates as usual
      setStartDate(startDate);
      setEndDate(endDate);
    }
  };

  const isOutsideRange = (day) => {
    if (Moment().startOf("day") > day.startOf("day")) {
      return true;
    }
    if (startDate && !endDate) {
      const closest = findClosestDate(startDate);
      return closest ? day.isAfter(closest) : closest;
    } else {
      return false;
    }
  };
  const findClosestDate = (date) => {
    let closest = date;
    items.forEach((element) => {
      const start = element.start;
      const startDate = Moment(start, "YYYY-MM-DD HH:mm:ss");
      if (startDate.startOf("day").format() == date.startOf("day").format()) {
        closest = startDate;
      } else if (
        startDate &&
        startDate.isAfter(date) &&
        startDate.isBefore(closest)
      ) {
        closest = startDate;
      } else if (startDate.isAfter(date) && closest == date) {
        closest = startDate;
      }
    });
    return date == closest ? false : closest;
  };

  const reset = () => {
    setStartDate(null);
    setEndDate(null);
    setFocusedInput("startDate");
  };

  const onFocusChange = (focusedInput) => {
    setFocusedInput(focusedInput || "startDate");
  };

  const loadItems = (currentDateSet) => {
    const { config } = props;
    const { url } = config;
    currentDateSet = currentDateSet || currentDate;

    const firstDate = currentDateSet.startOf("month").format("YYYY-MM-DD");
    const lastDate = currentDateSet
      .add(2, "months")
      .startOf("month")
      .format("YYYY-MM-DD");

    setIsLoaded(false);

    fetch(`${url}?start=${firstDate}&end=${lastDate}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
  };

  const onNextMonths = (currentDate) => {
    loadItems(currentDate);
  };

  const onPrevMonths = (currentDate) => {
    loadItems(currentDate);
  };

  useEffect(() => {
    Moment.locale("fr");
    setIsLoading(false);
    loadItems();
    setIsLoading(true);
  }, []);

  const { buttonSetDateRange, buttonClear } = props.config;

  const setDateRange = () => {
    try {
      if (startDate && endDate) {
        props.config.onSetDateRange(startDate, endDate);
      } else {
        props.config.onSetDateRangeFailed("please select date range!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={"container-date-range"}>
      {isLoaded}
      {isLoading ? (
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          disabled={!isLoaded}
          startDateId={"field-start-id"}
          endDateId={"field-end-id"}
          onDatesChange={handleDatesChange}
          focusedInput={focusedInput}
          onFocusChange={(focusedInput) => onFocusChange(focusedInput)}
          renderCalendarDay={({ day, modifiers, ...props }) => {
            const blockedData = items.filter(({ start, end, color }) =>
              day && day.isBetween(Moment(start), Moment(end), "D", "()")
                ? { start, end, color }
                : null
            );

            const isOutsideDay = day && day.isBefore(Moment());

            if (blockedData.length > 0) {
              return blockedData.map(({ start, end, color }) => (
                <BlockedTd
                  key={`${start}-${end}`}
                  daySize={props.daySize}
                  color={color}
                  blocked={true}
                  isOutsideDay={isOutsideDay}
                  style={{ width: props.daySize, height: props.daySize }}
                >
                  <Day daySize={props.daySize}>
                    <span>{day && day.format("D")}</span>
                  </Day>
                </BlockedTd>
              ));
            }
            const matchingStartData = items.find(
              ({ start }) => day && day.isSame(Moment(start), "D")
            );
            const matchingEndData = items.find(
              ({ end }) => day && day.isSame(Moment(end), "D")
            );

            if (matchingStartData && matchingEndData) {
              const color1 = matchingStartData.color;
              const color2 = matchingEndData.color;

              return (
                <HighLightedTd
                  key={`${matchingStartData.start}-${matchingEndData.end}`}
                  daySize={props.daySize}
                  color1={color1}
                  color2={color2}
                  isOutsideDay={isOutsideDay}
                  style={{ width: props.daySize, height: props.daySize }}
                >
                  <Day daySize={props.daySize}>
                    <span>{day && day.format("D")}</span>
                  </Day>
                </HighLightedTd>
              );
            }
            const matchingData = items.find(
              ({ start, end }) =>
                (day && day.isSame(Moment(start), "D")) ||
                (day && day.isSame(Moment(end), "D"))
            );
            if (matchingData) {
              // Determine if it's the start or end date
              const isStartDate =
                day && day.isSame(Moment(matchingData.start), "D");
              const selectedStart =
                modifiers && modifiers.has("selected-start");
              const selectedEnd = modifiers && modifiers.has("selected-end");
              // Map CheckTd components for matching data where checkIn is true
              return (
                <CheckTd
                  key={matchingData.start}
                  daySize={props.daySize}
                  color={matchingData.color}
                  checkIn={isStartDate}
                  isOutsideDay={isOutsideDay}
                  style={{ width: props.daySize, height: props.daySize }}
                  onClick={(event) =>
                    props.onDayClick && props.onDayClick(day || Moment(), event)
                  }
                  selectedStart={selectedStart}
                  selectedEnd={selectedEnd}
                  onMouseEnter={(event) =>
                    props.onDayMouseEnter &&
                    props.onDayMouseEnter(day || Moment(), event)
                  }
                  onMouseLeave={(event) =>
                    props.onDayMouseLeave &&
                    props.onDayMouseLeave(day || Moment(), event)
                  }
                >
                  <Day daySize={props.daySize}>
                    <span>{day && day.format("D")}</span>
                  </Day>
                </CheckTd>
              );
            }

            return <CalendarDay day={day} modifiers={modifiers} {...props} />;
          }}
          isOutsideRange={(day) => isOutsideRange(day)}
          minimumNights={0}
          enableOutsideDays={false}
          onPrevMonthClick={(currentDate) => onNextMonths(currentDate)}
          onNextMonthClick={(currentDate) => onPrevMonths(currentDate)}
          showDefaultInputIcon
          showClearDates
          hideKeyboardShortcutsPanel
          numberOfMonths={3}
        />
      ) : (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      )}
      {buttonSetDateRange && (
        <button onClick={() => setDateRange(startDate, endDate)}>
          Set date range
        </button>
      )}
      {
        buttonClear && (
          <button onClick={() => reset()}>Reset</button>
        ) /*maybe we dont need this button ? */
      }
    </div>
  );
};

export default App;
