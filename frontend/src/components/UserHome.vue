<template>
  <div class="mentor-home">
    <h1 class="mentor-title">Mentor's Dashboard</h1>

    <div class="mentor-stats">
      <div class="statistic disposition-stat">
        <h2>Approved/Updated Dispositions</h2>
        <p>{{ dispositionsCount }}</p>
      </div>

      <div class="statistic theme-stat">
        <h2>Submitted Themes</h2>
        <p>{{ themesCount }}</p>
      </div>

      <div class="statistic candidates-stat">
        <h2>Total Candidates</h2>
        <p>{{ candidatesCount }}</p>
        <ul class="candidate-list">
          <li v-for="candidate in candidates" :key="candidate.id" class="candidate-item">
            {{ candidate.name }}
          </li>
        </ul>
      </div>

      <div class="statistic theme-stat">
        <div id="calendar" class="calendar-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

export default {
  data() {
    return {
      mentorId: '',
      dispositionsCount: 0,
      themesCount: 0,
      candidatesCount: 0,
      candidates: [],
      calendarEvents: []
    };
  },
  methods: {
    initializeCalendar() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    events: this.calendarEvents,
    displayEventTime: false,
    eventContent: (arg) => {
      let arrayOfDomNodes = []
      let titleEl = document.createElement('div')
      titleEl.innerHTML = arg.event.title
      arrayOfDomNodes.push(titleEl)
  
      if (arg.event.extendedProps.description) {
        let descEl = document.createElement('div')
        descEl.innerHTML = arg.event.extendedProps.description
        arrayOfDomNodes.push(descEl)
      }
  
      return { domNodes: arrayOfDomNodes }
    }
  });
  calendar.render();
},
formatCalendarEvents(events) {
  if (Array.isArray(events)) {
    const formattedEvents = events.map((event) => ({
      title: String(event.title),
      start: event.start,
      color: '#000080',
      extendedProps: {
        description: event.description
      }
    }));
    return formattedEvents;
  } else {
    return [];
  }
},
  },
  async created() {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('http://localhost:3000/profile/current');
      this.mentorId = response.data.id;

      const dispositionsResponse = await axios.get(`http://localhost:3000/status/mentor/dispositionsCount/${this.mentorId}`);
      this.dispositionsCount = dispositionsResponse.data.dispositionsCount;

      const themesResponse = await axios.get(`http://localhost:3000/status/mentor/themesCount/${this.mentorId}`);
      this.themesCount = themesResponse.data.themesCount;

      const candidatesResponse = await axios.get(`http://localhost:3000/status/mentor/candidates/${this.mentorId}`);
      this.candidatesCount = candidatesResponse.data.candidatesCount;
      this.candidates = candidatesResponse.data.candidates;

      const calendarResponse = await axios.get(`http://localhost:3000/status/calendar/${this.mentorId}`);
      const events = this.formatCalendarEvents(calendarResponse.data);

      this.calendarEvents = events;

      this.initializeCalendar();
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style scoped>
.mentor-home {
  background-color: #f0f0f0;
  color: #333;
  font-family: Arial, sans-serif;
  padding: 20px;
  height: 600px;
}

.mentor-title {
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
}

.mentor-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.statistic {
  background-color: #fafafa;
  padding: 20px;
  margin: 10px;
  border-radius: 10px;
  width: 90%;
  box-sizing: border-box;
  text-align: center;
}

.statistic h2 {
  font-size: 1.4em;
  margin-bottom: 10px;
  color: #1c8cdc;
}

.statistic p {
  font-size: 1.6em;
  color: #555;
}

.disposition-stat {
  border-left: 10px solid #f1c40f;
}

.theme-stat {
  border-left: 10px solid #e67e22;
}

.candidates-stat {
  border-left: 10px solid #16a085;
}

.candidate-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.candidate-item {
  padding: 5px;
  margin: 5px 0;
  background-color: #e6e6e6;
  border-radius: 5px;
}

.fc-event {
  background-color: #000080;
  color: #ffffff;
}

.fc-event-title {
  font-size: 14px;
  font-weight: bold;
}

.fc-event-container .fc-event {
  border-color: #000080;
}

.fc-event:hover {
  color: #000080;
  background-color: #ffffff;
}

.calendar-container {
  height: 100%;
}

.calendar-container .fc-event-main {
  display: flex;
  flex-direction: column;
  align-items: start;
}
</style>
