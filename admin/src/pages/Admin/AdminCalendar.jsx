import React, { useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useContext } from "react";
import { useEffect } from "react";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());
  const { aToken, getAllAppointments, cancelAppointment, appointments } = useContext(AdminContext)
  const [transformedAppointments, setTransformedAppointments] = useState({});
  
  useEffect(() => {
    if (aToken) {
      getAllAppointments()
      
                   
      
      
    }

  }, [aToken])

  
  // Helper function to format date as a key for appointments lookup
  const formatDateKey = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
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

   function getWeekday(dateStr) {
    const [day, month, year] = dateStr.split("_").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleString('en-US', { weekday: 'long' });
  }
  
  // Helper function to find the period based on the day and time
  const getPeriod = (weekday, slotTime) => {
    const timesForDay = periodTimes[weekday];
  
    // Return null if there are no times for the given weekday
    if (!timesForDay) {
      return null;
    }
  
    // Collect all indices where the slotTime matches
    const indices = [];
    timesForDay.forEach((time, index) => {
      if (time === slotTime) {
        indices.push(index + 1); // Use 1-based index
      }
    });
  
    // Return the array of indices, or null if no matches were found
    return indices.length > 0 ? indices : null;
  };
  

  useEffect(() => {
    const fetchAndTransformAppointments = async () => {
      try {
        if (aToken) {
          console.log("Token available, starting fetch...");
  
          // Clear local storage for debugging purposes
          localStorage.removeItem("appointments");
  
          let loadedAppointments = [];
          const savedAppointments = localStorage.getItem("appointments");
  
          // Fetch appointments from local storage or API
          if (savedAppointments) {
            loadedAppointments = JSON.parse(savedAppointments);
            console.log("Loaded from localStorage:", loadedAppointments);
          } else {
            const fetchedAppointments = await getAllAppointments();
            console.log("Fetched from API:", fetchedAppointments);
  
            loadedAppointments = fetchedAppointments || [];
            localStorage.setItem("appointments", JSON.stringify(loadedAppointments));
          }
  
          // Transform and set appointments
          const transformedData = transformAppointments(loadedAppointments);
          setTransformedAppointments(transformedData);
  
          // Log for debugging
          console.log("Final Transformed Appointments:", transformedData);
        }
      } catch (error) {
        console.error("Error in fetchAndTransformAppointments:", error);
      }
    };
  
    fetchAndTransformAppointments();
  }, [aToken]);

 function transformAppointments(appointments) {
  const appointmentsMap = {};

  console.log("Raw Appointments Count:", appointments.length);

  appointments.forEach((appointment, index) => {
    const { slotDate, slotTime, docData, userData, cancelled } = appointment;

    // Log the current appointment
    console.log(`Processing Appointment ${index + 1}:`, appointment);

    // Normalize and validate slotDate
    const [day, month, year] = slotDate.split("_").map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      console.error("Invalid slotDate:", slotDate);
      return; // Skip invalid dates
    }

    // Get weekday and period
    const weekday = date.toLocaleString("en-US", { weekday: "long" });
    const period = getPeriod(weekday, slotTime);

    if (!period) {
      console.warn(`No matching period for ${slotTime} on ${weekday}`);
      return; // Skip unmatched times
    }

    // Initialize the array for the date if not present
    if (!appointmentsMap[slotDate]) {
      appointmentsMap[slotDate] = [];
    }

    // Check for existing appointment with the same slotTime and period
    const existingAppointment = appointmentsMap[slotDate].find(
      (appt) => appt.slotTime === slotTime && appt.period === period
    );

    if (existingAppointment) {
      // Handle the case where an appointment with the same slotTime and period already exists
      console.warn(`Duplicate appointment found for ${slotTime} on ${slotDate}`);
      // You can choose to merge the data or keep both appointments
      // For example, here we keep both appointments
    }

    // Add appointment to the map
    appointmentsMap[slotDate].push({
      period,
      slotTime,
      cancelled: {cancelled: (cancelled)? 'CANCELLED' : ' '},
      docData: { name: docData?.name || "Unknown" },
      userData: { name: userData?.name || "Unknown" },
    });

    // Log after adding to the map
    console.log(`After Adding - Appointments on ${slotDate}:`, appointmentsMap[slotDate]);
  });

  console.log("Final Transformed Appointments Map:", appointmentsMap);
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
    const weekDays = [ "Mon", "Tue", "Wed", "Thu", "Fri" ];
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
  
      // Get the period times for the current day
      const periodsForToday = periodTimes[dayName];
  
      // Group appointments by period
      const groupedAppointments = {};
      dailyAppointments.forEach((appointment) => {
        const { period } = appointment;
        if (!groupedAppointments[period]) {
          groupedAppointments[period] = [];
        }
        groupedAppointments[period].push(appointment);
      });
  
      // Prepare periods 1 to 8 for each day
      const periods = periodsForToday.map((time, i) => {
        const periodAppointments = groupedAppointments[i + 1] || [];
        return (
          <div key={i} className="periodContainer">
            {periodAppointments.length > 0 ? (
              <div className="multipleAppointments">
                {periodAppointments.map((appt, idx) => (
                  <div key={idx} className="appointmentIndicator">
                    <span>{`${appt.cancelled.cancelled}  ${appt.slotTime}   |   Period ${appt.period}   |  Counsellor: ${appt.docData.name}   |  Meeting With: ${appt.userData.name} `}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="noAppointment">Period {i + 1} ({time})</div>
            )}
          </div>
        );
      });
  
      daysColumns.push(
        <div key={day} className="dayColumn">
          <div
            className={`day ${
              isSameDay(currentDate, selectedDate) ? "selectedDay" : ""
            } ${isSameDay(currentDate, new Date()) ? "today" : ""}`}
            onClick={() => setSelectedDate(currentDate)}
          >
            {currentDate.getDate()}
          </div>
          <div className="appointmentsContainer">{periods}</div>
        </div>
      );
    }

    return <div className="weekContainer">{daysColumns}</div>;

  };

  return (
    <section className="App">
      <style>{`
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
          grid-template-columns: repeat(7, 1fr);
          margin: 16px 0;
        }
        .weekContainer {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        .dayColumn {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .day {
          margin: 12px;
          width: 30px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .weekNames {
          color: #9e9e9e;
          font-weight: bold;
        }
        .today {
          background: #efefee;
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
          align-items: center;
        }
        .appointmentIndicator {
          background-color: #4CAF50;
          color: white;
          border-radius: 5px;
          padding: 2px 4px;
          font-size: 0.8em;
          margin-top: 3px;
        }
          .period {
          margin: 4px 0;
          padding: 4px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 80%;
          text-align: center;
        }

        .period.filled {
          background-color: #4CAF50;
          color: white;
        }
          .periodContainer {
          margin: 4px 0;
          padding: 4px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
          text-align: center;
          background-color: #DCDCDC;
        }

        .multipleAppointments {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          justify-content: center;
        }

        .appointmentIndicator {
          background-color: #4CAF50;
          color: white;
          border-radius: 5px;
          padding: 2px 8px;
          font-size: 0.8em;
          margin-top: 3px;
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