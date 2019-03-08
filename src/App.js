import '@babel/polyfill';
import React, { Component } from 'react';
import Zermelo from './Zermelo';
import moment from 'moment';

const today = new Date();
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


function getScheduleTimestamp(time) {
  //accepts hh:mm format - convert hh:mm to timestamp
  time = time.replace(/ /g,'');
  let timeArray = time.split(':');
  let timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
  return timeStamp;
}

function placeEvents() {
  let element = $('.cd-schedule');
  let timeline = element.find('.timeline');
  let timelineItems = timeline.find('li');
  let timelineItemsNumber = timelineItems.length;
  let timelineStart = getScheduleTimestamp(timelineItems.eq(0).text());
  //need to store delta (in our case half hour) timestamp
  let timelineUnitDuration = getScheduleTimestamp(timelineItems.eq(1).text()) - getScheduleTimestamp(timelineItems.eq(0).text());
  let eventsWrapper = element.find('.events');
  let eventsGroup = eventsWrapper.find('.events-group');
  let singleEvents = eventsGroup.find('.single-event');
  let eventSlotHeight = eventsGroup.eq(0).children('.top-info').outerHeight();

  singleEvents.each(function () {
    //place each event in the grid -> need to set top position and height
    let start = getScheduleTimestamp($(this).attr('data-start')), duration = getScheduleTimestamp($(this).attr('data-end')) - start;
    let eventTop = eventSlotHeight * (start - timelineStart) / timelineUnitDuration, eventHeight = eventSlotHeight * duration / timelineUnitDuration;
    $(this).css({
      top: (eventTop - 1) + 'px',
      height: (eventHeight + 1) + 'px'
    });
  });
  element.removeClass('loading');
}

class Appointment extends Component {
  render() {
    const a = this.props.data;
    return (
      <li className="single-event" data-start={moment(a.startAt).format('HH:mm')} data-end={moment(a.endAt).format('HH:mm')} data-content={`event-abs-circuit`} data-event={`event-${this.props.i}`} key={a.appointmentInstance}>
        <a href="#0">
          <span className="event-date">{moment(a.startAt).format('HH:mm')} - {moment(a.endAt).format('HH:mm')}</span>
          <em className="event-location">{a.locations[0]}</em>
          <em className="event-period">#{a.startTimeSlot}</em>
          <em className="event-name">{a.subjects[0]}</em> {a.teachers.length > 0 ? <em className="event-teacher">&mdash;{a.teachers[0]}</em> : ''}
        </a>
      </li>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.zerm = new Zermelo('psg');
    this.logIn = this.logIn.bind(this);
    this.state = {
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null,
    };
  }

  get accessToken() {
    return localStorage.getItem('accessToken');
  }

  dayTimestamp(day) {
    if (days.indexOf(day) === -1) return console.error('Invalid date');
    return {
      day: days.indexOf(day),
      start: Math.round(new Date(today.setDate(today.getDate() - today.getDay() + (days.indexOf(day) + 1))).getTime() / 1000),
      end: Math.round(new Date(today.setDate(today.getDate() - today.getDay() + (days.indexOf(day) + 2))).getTime() / 1000)
    };
  }

  getAppointments(day) {
    return this.zerm.request('GET', '/appointments', {
      user: '~me',
      start: day ? this.dayTimestamp(day).start : this.dayTimestamp('Monday').start,
      end: day ? this.dayTimestamp(day).end : this.dayTimestamp('Friday').end
    }).then(({response: { data }}) => {
      data = data.sort((a, b) => a.start - b.start)
      data = data.map(a => {
        return {
          ...a,
          startAt: new Date(a.start * 1000),
          endAt: new Date(a.end * 1000)
        };
      });
      return data;
    });
  }

  componentDidMount() {
    this.renderAppointments();
    setTimeout(() => placeEvents(), 500);
  }

  async renderAppointments() {
    const listDays = days.map(async day => {
      let i = 1;
      this.setState({
        [day]: !this.accessToken ? <li></li> : (await this.getAppointments(day)).map(a => <Appointment data={a} i={i++} />)
      });
    });
  }

  logIn(e) {
    e.preventDefault(e);
    const authorizationCode = prompt('Enter an authorization code:');
    if (!prompt) throw alert('Invalid authorization code');
    this.zerm.authorize(authorizationCode);
  }

  render() {
    return (
      <div className="App">
        {this.accessToken ? (
          <button onClick={this.zerm.logOut}>Log out</button>
        ) : (
          <button onClick={this.logIn}>Log in</button>
        )}
        <div className="cd-schedule loading">
          <div className="timeline">
            <ul>
              <li><span>08:00</span></li>
              <li><span>08:30</span></li>
              <li><span>09:00</span></li>
              <li><span>09:30</span></li>
              <li><span>10:00</span></li>
              <li><span>10:30</span></li>
              <li><span>11:00</span></li>
              <li><span>11:30</span></li>
              <li><span>12:00</span></li>
              <li><span>12:30</span></li>
              <li><span>13:00</span></li>
              <li><span>13:30</span></li>
              <li><span>14:00</span></li>
              <li><span>14:30</span></li>
              <li><span>15:00</span></li>
              <li><span>15:30</span></li>
              <li><span>16:00</span></li>
              <li><span>16:30</span></li>
              <li><span>17:00</span></li>
            </ul>
          </div>
          <div className="events">
            <ul>
              {
                days.map(day => {
                  return (
                    <li className="events-group">
                      <div className="top-info"><span>{day}</span></div>
                      <ul>{this.state[day]}</ul>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div className="event-modal">
            <header className="header">
              <div className="content">
                <span className="event-date"></span>
                <h3 className="event-name"></h3>
              </div>

              <div className="header-bg"></div>
            </header>

            <div className="body">
              <div className="event-info"></div>
              <div className="body-bg"></div>
            </div>

            <a href="#0" className="close">Close</a>
          </div>
          <div className="cover-layer"></div>
        </div>
      </div>
    );
  }
}

export default App;
