import React, { useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useContext } from "react";
import { useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());
  const { cToken, getAppointments, appointments, getAllAppointments, allAppointments } = useContext(DoctorContext)
  const [transformedAppointments, setTransformedAppointments] = useState({});

  useEffect(() => {
    if (cToken) {
      getAppointments()
      getAllAppointments()


    }

  }, [cToken])


  // Helper function to format date as a key for appointments lookup
  const formatDateKey = (date) => {
    const day = date.getDate().toString(); // No padding
    const month = (date.getMonth() + 1).toString(); // No padding
    const year = date.getFullYear();
    return `${day}_${month}_${year}`;
  };

  // Define default period times for each day
  const periodTimes = {
    "Sunday": [],
    "Monday": ["08:50", "09:30", "10:30", "11:10", "11:50", "13:40", "14:20", "15:00"],
    "Tuesday": ["09:10", "09:50", "10:50", "11:30", "12:10", "14:00", "14:40", "15:20"],
    "Wednesday": ["08:50", "09:30", "10:30", "11:10", "11:50", "14:00", "14:40", "15:20"],
    "Thursday": ["09:10", "09:50", "10:50", "11:30", "12:10", "14:00", "14:40", "15:20"],
    "Friday": ["09:10", "09:50", "10:50", "11:30", "12:10", "14:00", "14:40", "15:20"],
    "Saturday": []
  };

  const lunchTimes = {
    "Sunday": [],
    "Monday": ["12:25"],
    "Tuesday": ["12:50"],
    "Wednesday": ["12:25"],
    "Thursday": ["12:50"],
    "Friday": ["12:50"],
    "Saturday": []
  };

  function getWeekday(dateStr) {
    const [day, month, year] = dateStr.split("_").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleString('en-US', { weekday: 'long' });
  }

  // Helper function to find the period based on the day and time
  const getPeriod = (weekday, slotTime) => {
    const timesForDay = periodTimes[weekday];
    const timesForLunch = lunchTimes[weekday];
  
    if (!timesForDay && timesForLunch) {
      return null;
    }
  
    // Convert time strings to minutes for easier comparison
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
  
    const slotMinutes = timeToMinutes(slotTime);
  
    // Find the closest matching period time
    let closestPeriod = null;
    let minDifference = Infinity;
  
    timesForDay.forEach((time, index) => {
      const periodMinutes = timeToMinutes(time);
      const difference = Math.abs(periodMinutes - slotMinutes);
  
      if (difference < minDifference) {
        minDifference = difference;
        closestPeriod = index + 1; // Periods are indexed from 1
      }
    });
  
    // Check if it's a lunch time
    const isLunch = timesForLunch.includes(slotTime) ? "Lunch" : null;
  
    // Return closest period or lunch
    return isLunch ? "Lunch" : closestPeriod;
  };
  


  useEffect(() => {
    const fetchAndTransformAppointments = async () => {
      try {
        if (cToken) {
          console.log("Token available, starting fetch...");

          // Clear localStorage (optional, for debugging purposes)
          localStorage.removeItem("appointments");

          let loadedAppointments = [];
          const savedAppointments = localStorage.getItem("appointments");

          // Load from localStorage if available
          if (savedAppointments) {
            loadedAppointments = JSON.parse(savedAppointments);
            console.log("Loaded from localStorage:", loadedAppointments);
          } else {
            // Fetch from API
            const extractAppointment = await getAllAppointments();

            const fetchedAppointments = extractAppointment;

            console.log("Fetched from API:", extractAppointment);

            // Handle missing data 
            loadedAppointments = fetchedAppointments || [];
            localStorage.setItem("appointments", JSON.stringify(loadedAppointments));
          }

          // Ensure the data is an array
          if (!Array.isArray(loadedAppointments)) {
            console.error("Invalid appointments data:", loadedAppointments);
            return;
          }

          // Transform appointments
          const transformedData = transformAppointments(loadedAppointments);
          setTransformedAppointments(transformedData);

          console.log("Final Transformed Appointments:", transformedData);
        }
      } catch (error) {
        console.error("Error in fetchAndTransformAppointments:", error);
      }
    };

    fetchAndTransformAppointments();
  }, [cToken]);




  function transformAppointments(allAppointments) {
    if (!Array.isArray(allAppointments)) {
      console.error("Invalid input: allAppointments is not an array", allAppointments);
      return {};
    }
  
    const appointmentsMap = {};
  
    allAppointments.forEach((appointment) => {
      const { slotDate, slotTime, docData, userData, cancelled } = appointment;
  
      const [day, month, year] = slotDate.split("_").map(Number);
      const date = new Date(year, month - 1, day);
      if (isNaN(date.getTime())) return;
  
      const weekday = date.toLocaleString("en-US", { weekday: "long" });
  
      // Find closest period (instead of exact match)
      const period = getPeriod(weekday, slotTime);
      if (!period) return;
  
      if (!appointmentsMap[slotDate]) {
        appointmentsMap[slotDate] = [];
      }
  
      appointmentsMap[slotDate].push({
        period,
        slotTime,
        cancelled: { cancelled: (cancelled) ? 'CANCELLED' : ' ' },
        docData: { name: docData?.name || "Unknown" },
        userData: { name: userData?.name || "Unknown" },
      });
    });
  
    return appointmentsMap;
  }
  









  const getCurrentMonthYear = (date) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Function to get the start of the current week (Sunday)
  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek;
    return new Date(date.setDate(diff));
  };

  const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };
  // Function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }
  const getHeader = () => {
    return (
      <div className="header">
        <div className="todayButton" onClick={() => setActiveDate(new Date())}>
          Today
        </div>
        <button
          className="navButton"
          onClick={() => setActiveDate(addDays(activeDate, -7))}
        >
          &#9664;
        </button>
        <button
          className="navButton"
          onClick={() => setActiveDate(addDays(activeDate, 7))}
        >
          &#9654;
        </button>
        <h2 className="currentMonth">{getCurrentMonthYear(activeDate)}</h2>
      </div>
    );
  };

  const getWeekDaysNames = () => {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    return (
      <div className="daysOfWeek">
        {weekDays.map((day, index) => (
          <div className="day weekNames" key={index}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const generateDatesForCurrentWeek = () => {
    const weekStartDate = getStartOfWeek(new Date(activeDate));
    const daysColumns = [];

    for (let day = 1; day < 6; day++) {
      const currentDate = addDays(weekStartDate, day);
      const dateKey = formatDateKey(currentDate);
      const dailyAppointments = transformedAppointments[dateKey] || [];
      const dayName = currentDate.toLocaleString('en-US', { weekday: 'long' });

      console.log(`Date: ${dateKey}, Day: ${dayName}, Appointments:`, dailyAppointments);
      console.log("Daily Appointments for", dateKey, ":", dailyAppointments);

      // Get period and lunch times for the current day
      const periodsForToday = periodTimes[dayName];
      const lunchForToday = lunchTimes[dayName];

      // Filter lunch appointments
      const lunchAppointments = dailyAppointments.filter((appointment) => {
        return lunchForToday.includes(appointment.slotTime);
      });

      // Group appointments by period
      const groupedAppointments = {};
      dailyAppointments.forEach((appointment) => {
        const { period } = appointment;
        if (!groupedAppointments[period]) {
          groupedAppointments[period] = [];
        }
        groupedAppointments[period] = groupedAppointments[period].concat(appointment);
      });

      // Prepare schedule for each day
      const schedule = [];
      periodsForToday.forEach((time, i) => {
        // Render Periods
        const periodAppointments = groupedAppointments[i + 1] || [];
        schedule.push(
          <div key={`period-${i}`} className="periodContainer">
            {periodAppointments.length > 0 ? (
              <div className="multipleAppointments">
                {periodAppointments.map((appt, idx) => (
                  <div
                    key={idx}
                    className={`appointmentIndicator ${appt.cancelled.cancelled === 'CANCELLED' ? "cancelled" : ""}`}
                    style={appt.cancelled.cancelled === 'CANCELLED' ? { backgroundColor: "#FF5733", color: "white" } : {}}
                  >
                    <span>
                      {`Period ${appt.period} (${appt.slotTime}) | Counsellor: ${appt.docData.name} | Meeting With: ${appt.userData.name}`}
                      {appt.cancelled.cancelled === 'CANCELLED' ? " (CANCELLED)" : ""}
                    </span>
                  </div>


                ))}
              </div>
            ) : (
              <div className="noAppointment">Period {i + 1} ({time})</div>
            )}
          </div>
        );

        // Insert Lunch Break after Period 5 (index 4)
        if (i === 4 && lunchForToday.length > 0) {
          lunchForToday.forEach((lunchTime, j) => {
            schedule.push(
              <div key={`lunch-${j}`} className="lunchContainer">
                Lunch Break ({lunchTime})
                {lunchAppointments.map((appt, idx) => (
                  <div key={idx} className="appointmentIndicator">
                    <span>{`(${appt.slotTime}) | Counsellor: ${appt.docData.name} | Meeting With: ${appt.userData.name}`}</span>
                  </div>
                ))}
              </div>
            );
          });
        }
      });

      daysColumns.push(
        <div key={day} className="dayColumn">
          <div
            className={`day ${isSameDay(currentDate, selectedDate) ? "selectedDay" : ""
              } ${isSameDay(currentDate, new Date()) ? "today" : ""}`}
            onClick={() => setSelectedDate(currentDate)}
          >
            {currentDate.getDate()}
          </div>
          <div className="appointmentsContainer">{schedule}</div>
        </div>
      );
    }

    return <div className="weekContainer">{daysColumns}</div>;
  };


  return (
    <section className="App">
      <style>{`
.lunchContainer,
.periodContainer {
  width: 100%; /* Stretch to fill column width */
  height: 150px; /* Uniform height for all boxes */
  overflow-y: auto; /* Enable scrolling if content overflows */
  margin: 4px 0;
  padding: 3px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  background-color: #DCDCDC;
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
  flex-direction: column; /* Stack content vertically */
}

.App {
  font-family: sans-serif;
  text-align: center;
  color: #212121;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.currentMonth {
  margin-left: 24px;
  font-size: 24px;
}

.daysOfWeek {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* Create equal-width columns */
  margin: 16px 0;
  text-align: center; /* Center align day names */
  gap: 8px; /* Ensure consistent spacing */
}

.weekContainer {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* Equal width columns for days */
  gap: 8px; /* Even spacing between columns */
}

.dayColumn {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Stretch columns to fill space */
  justify-content: flex-start; /* Align to top */
}

.day {
  width: 100%; /* Stretch to match column width */
  height: auto; /* Adjust height dynamically based on content */
  cursor: pointer;
  margin-bottom: 4px; /* Space between day header and content */
  text-align: center; /* Center align text */
}

.weekNames {
  color: #9e9e9e;
  font-weight: bold;
  text-align: center; /* Align week names centrally */
  margin-bottom: 4px; /* Align closer to numbers */
}

.today {
  font-weight: bold;
  color: #3366ff; /* Highlight today's date without a background */
}

.selectedDay {
  color: white;
  background: #3366ff;
  border-radius: 50%;
}

.navButton {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.navButton:hover {
  background: #f0f0f0;
  border-radius: 50%;
}

.todayButton {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  margin-right: 8px;
}

.todayButton:hover {
  background-color: #e0e0e0;
  color: white;
}

.appointmentsContainer {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Stretch to fill available space */
  gap: 4px; /* Add spacing between appointments */
}
.cancelled {
  background-color: #FF5733 !important; /* Red background */
  color: white !important;
  text-decoration: line-through;
}

.appointmentIndicator {
  background-color: #4CAF50;
  color: white;
  border-radius: 10px;
  padding: 2px 4px;
  font-size: 0.8em;
  white-space: normal; /* Allow line breaks */
  word-wrap: break-word; /* Force long text to wrap */
  text-align: center; /* Center-align text */
  margin-top: 3px;
}

.multipleAppointments {
  display: flex;
  flex-direction: column; /* Stack appointments vertically */
  gap: 5px;
  justify-content: start;
}

.noAppointment {
  color: #999;
  font-style: italic;
}



      `}</style>
      {getHeader()}
      {getWeekDaysNames()}
      {generateDatesForCurrentWeek()}
    </section>
  );
};

export default Calendar;
