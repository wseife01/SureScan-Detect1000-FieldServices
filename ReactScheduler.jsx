import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotScheduler } from "@daypilot/daypilot-lite-react";
import "../assets/themes/dark.css";
import "../assets/themes/light.css";
import "../assets/toolbar.css";

const ReactScheduler = () => {
  const [scheduler, setScheduler] = useState(null);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);

  const [startDate, setStartDate] = useState(DayPilot.Date.today().firstDayOfWeek());
const [days, setDays] = useState(7);
  const [theme, setTheme] = useState("light");




  const themes = [
    { name: "light", text: "Light" },
    { name: "dark", text: "Dark" }
  ];

  const colors = [
    { name: "(default)", id: null },
    { name: "Blue",    id: "#6fa8dc" },
    { name: "Green",   id: "#93c47d" },
    { name: "Yellow",  id: "#ffd966" },
    { name: "Red",     id: "#f6b26b" },
    { name: "Peach",     id: "#FBE2D5" },
    { name: "Kip OC",     id: "#F2CEEF" },
    { name: "Purple",     id: "#E49EDD" }
  ];

  const editEvent = async (e) => {
    const form = [
      { name: "Text", id: "text" },
      { name: "Start", id: "start", type: "datetime", enabled: true },
      { name: "End", id: "end", type: "datetime", enabled: true },
      { name: "Resource", id: "resource", type: "select", options: resources },
      { name: "Color", id: "backColor", type: "select", options: colors }
    ];

    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }

    scheduler.events.update(modal.result);
  };

  const onTimeRangeSelected = async (args) => {
    const scheduler = args.control;
    const modal = await DayPilot.Modal.prompt("Create a new event:", "SMF Airport");
    scheduler.clearSelection();
    if (modal.canceled) {
      return;
    }
    scheduler.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      resource: args.resource,
      text: modal.result
    });
  };

  const onBeforeEventRender = (args) => {
    args.data.borderColor = "darker";
    // add edit icon to the event
    args.data.areas = [
      {
        right: 5,
        top: "calc(50% - 15px)",
        width: 30,
        height: 30,
        symbol: "/icons/daypilot.svg#edit",
        borderRadius: "50%",
        backColor: "#ffffff99",
        fontColor: "#999999",
        padding: 5,
        onClick: async (args) => {
          await editEvent(args.source);
        }
      }
    ];
  };

  useEffect(() => {

    const firstDayOfMonth = DayPilot.Date.today().firstDayOfMonth();

    const events = [
      {
        id: 1,
        text: "Event 1",
        start: firstDayOfMonth.addDays(1),
        end: firstDayOfMonth.addDays(6),
        resource: "R2",
      }
    ];
    setEvents(events);

    const resources = [
      { name: "Dean Miller", id: "R1"},
      { name: "Art Beede", id: "R2"},
      { name: "JJ", id: "R3"},
      { name: "Kip Seifert", id: "R4"},
     
    ];
    setResources(resources);

    scheduler?.scrollTo(DayPilot.Date.today().firstDayOfMonth());

  }, [scheduler]);

  return (
    <div>

    <div className="toolbar">
      <label htmlFor="theme">Theme:</label>
      <select
        id="theme"
        value={theme}
        onChange={(e) => {
          setTheme(e.target.value);
        }}
      >
        {themes.map((t) => (
          <option key={t.name} value={t.name}>
            {t.text}
          </option>
        ))}
      </select>
    </div>

     <DayPilotScheduler
  scale="Hour"
  timeHeaders={[
    { groupBy: "Day", format: "dddd M/d" },
    { groupBy: "Hour" }
  ]}
  startDate={startDate}
  days={days}
  cellWidth={60}
  eventHeight={50}
  businessBeginsHour={3}
  businessEndsHour={24}
  showNonBusiness={false}
  events={events}
  resources={resources}
  onBeforeEventRender={onBeforeEventRender}
  onTimeRangeSelected={onTimeRangeSelected}
  controlRef={setScheduler}
  theme={theme}
/>

    </div>
  );
}
export default ReactScheduler;
