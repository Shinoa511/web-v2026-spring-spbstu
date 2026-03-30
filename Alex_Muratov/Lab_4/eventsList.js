import {eventsListFiller} from "./eventsListFiller.js"
import {Event} from "./event.js"
import {monthNames} from "./constants.js";


document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("EventsList")){

        const newEventsList = [];
        eventsListFiller(20,newEventsList)

        localStorage.setItem("EventsList",JSON.stringify(newEventsList));

    }
})

const parsedList = JSON.parse(localStorage.getItem("EventsList"))
const restoredEvents = parsedList.map((data)=>new Event(data.id,data.title,data.participants,data.date));


function sortByDate(events) {
    return events.sort((a,b) => a.date - b.date);
}

function groupByDate(events) {
    const sortedEvents = sortByDate(events)
    const dateGroup = {};

    for (let event of sortedEvents){

        const curDate = event.date;

        if (!dateGroup[curDate]){
            dateGroup[curDate] = [];
        }
        dateGroup[curDate].push(event);
    }
    return dateGroup;
}

function groupByParticipantsCount(events){
    const countGroup = {};

    for (let event of events){
        const participantsCount = event.participantCount;

        if ( !countGroup[participantsCount]){
            countGroup[participantsCount] = [];
        }
        countGroup[participantsCount].push(event);
    }
    return countGroup;
}

function getParticipantList(events) {
    const participantList = new Set();

    for (let event of  events){
        for ( let participant of event.participants){
            participantList.add(participant);
        }
    }
    return participantList;
}

function groupByMonths(events,month){
    return events.filter((event) =>{
        const eventDate = new Date(event.date);
        console.log(monthNames[eventDate.getMonth()])
        return  month === monthNames[eventDate.getMonth()]
    })
}

function getPersonEvents(events,person){
    return events.filter((event) => event.participants.includes(person))
}

console.log(groupByMonths(restoredEvents,"Апрель"))

console.log(getParticipantList(parsedList));

console.log(getPersonEvents(parsedList,"Андрей Васильев"));

console.log(groupByDate(parsedList));

console.log(groupByParticipantsCount(restoredEvents));

