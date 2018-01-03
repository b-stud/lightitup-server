import * as $ from 'jquery';
import Utils from './Utils';
import ScheduledEvent from '../../../ts/ControlInterface/Scheduler/ScheduledEvent';

export default class ScriptScheduler {

    static $schedulerWindow; // Scheduler modal window
    static choiceChanger;
    static scheduleForm;
    static $repetitionModeContainer;
    static onetimeForm;
    static repeatedForm;
    static hoursSelector;
    static minutesSelector;
    static btnAddEvent;
    static btnRemoveEvent;
    static btnShowCreationForm;
    static btnHideCreationForm;
    static calendar;
    static timeSpans;
    static $btnScheduleManager;
    static form;
    static effectsList;
    static oneTimeWeeksDay;
    static calendarList; // Wrapper for small devices
    static eventsPositionTracker = [];
    static eventHeightPercent = NaN;

    static scheduledEvents: Array<ScheduledEvent> = [];

    static init() {
        $(document).ready(function () {
            /**Selecting dom nodes***/
            ScriptScheduler.$schedulerWindow = $("#scheduler-section");
            ScriptScheduler.scheduleForm = <HTMLDivElement>document.getElementById("schedule-form");
            ScriptScheduler.choiceChanger
                = <HTMLSelectElement>ScriptScheduler.scheduleForm.querySelector("#choice-changer");
            ScriptScheduler.$repetitionModeContainer = $("#repetition-mode-container");
            ScriptScheduler.onetimeForm = ScriptScheduler.$repetitionModeContainer.find(".mode-onetime")[0];
            ScriptScheduler.repeatedForm = ScriptScheduler.$repetitionModeContainer.find("#mode-repeated")[0];
            ScriptScheduler.hoursSelector = <HTMLSelectElement>ScriptScheduler.scheduleForm.querySelector('#hours');
            ScriptScheduler.minutesSelector = <HTMLSelectElement>ScriptScheduler.scheduleForm.querySelector('#minutes');
            ScriptScheduler.btnAddEvent = ScriptScheduler.scheduleForm.querySelector('#btn-add-event');
            ScriptScheduler.btnRemoveEvent = ScriptScheduler.scheduleForm.querySelector('#btn-remove-event');
            ScriptScheduler.btnHideCreationForm=ScriptScheduler.scheduleForm.querySelector('#btn-hide-add-event-form');
            ScriptScheduler.btnShowCreationForm=ScriptScheduler.scheduleForm.querySelector('#btn-show-add-event-form');
            ScriptScheduler.calendar = document.getElementById("calendar");
            ScriptScheduler.timeSpans = ScriptScheduler.calendar.querySelector("#timeSpans").children.length;
            ScriptScheduler.$btnScheduleManager = $("button#scheduler");
            ScriptScheduler.form = ScriptScheduler.$schedulerWindow.find("form").first()[0];
            ScriptScheduler.effectsList = ScriptScheduler.$schedulerWindow.find('#effect-name')[0];
            ScriptScheduler.oneTimeWeeksDay =
                <HTMLSelectElement>ScriptScheduler.scheduleForm.querySelector("#onetime-weekday");

            ScriptScheduler.calendarList =
                <HTMLUListElement>ScriptScheduler.$schedulerWindow.find("#calendar-list-wrapper")[0];

            ScriptScheduler.initView(); // Build some HTML elements
            ScriptScheduler.bindEvents();
        });
    }

    static initView() {
        for (let i = 0; i < 24; i++) {
            let option = document.createElement('option');
            option.setAttribute('value', i + '');
            option.innerHTML = (i < 10)?('0'+i):(i+'');
            ScriptScheduler.hoursSelector.appendChild(option);
        }
        for (let i = 0; i < 60; i++) {
            let option = document.createElement('option');
            option.setAttribute('value', i + '');
            option.innerHTML = (i<10)?('0'+i):(i+'');
            ScriptScheduler.minutesSelector.appendChild(option);
        }
        $(ScriptScheduler.choiceChanger).on('change', () => {
            switch ($(ScriptScheduler.choiceChanger).val()) {
                case 'onetime':
                    $(ScriptScheduler.repeatedForm).hide(0);
                    $(ScriptScheduler.onetimeForm).show(0);
                    break;
                case 'repeated':
                    $(ScriptScheduler.repeatedForm).show(0);
                    $(ScriptScheduler.onetimeForm).hide(0);
                    break;
            }
        });

        (<any>ScriptScheduler.calendar.querySelectorAll(".daytime")).forEach((dayColumn) => {
            for (let i = 0; i < ScriptScheduler.timeSpans; i++) {
                let div = document.createElement('div');
                div.setAttribute('class', 'time-span');
                div.innerHTML = '';
                dayColumn.appendChild(div);
            }
        });
    };


    static bindEvents() {
        ScriptScheduler.$btnScheduleManager.on('click', function () {
            ScriptScheduler.show();
        });

        ScriptScheduler.btnAddEvent.addEventListener('click', (e) => {
            e.preventDefault();
            ScriptScheduler.createNewScheduledEvent();
        });

        ScriptScheduler.btnShowCreationForm.addEventListener('click', (e) => {
            e.preventDefault();
            ScriptScheduler.resetForm();
            ScriptScheduler.showCreationForm();
        });

        ScriptScheduler.btnHideCreationForm.addEventListener('click', (e) => {
            e.preventDefault();
            ScriptScheduler.hideCreationForm();
        });

        ScriptScheduler.$schedulerWindow.find('div.close').on('click', function () {
            ScriptScheduler.hide();
        });

        ScriptScheduler.btnRemoveEvent.addEventListener('click', function () {
            ScriptScheduler.removeScheduledEvents($(ScriptScheduler.form).data('id'));
        });
    };

    static showCreationForm(){
        $(ScriptScheduler.form).addClass('visible');
        $(ScriptScheduler.btnShowCreationForm).addClass('hidden');
        // Show or hide remove button
        if($(ScriptScheduler.form).data('id')) {
            $(ScriptScheduler.btnRemoveEvent).addClass('visible');
        } else {
            $(ScriptScheduler.btnRemoveEvent).removeClass('visible');
        }
    }

    static hideCreationForm(){
        $(ScriptScheduler.form).removeClass('visible');
        $(ScriptScheduler.btnShowCreationForm).removeClass('hidden');
    }

    static show() {
        ScriptScheduler.refresh().then(() => {
            Utils.$mainSectionElt.addClass('blur');
            ScriptScheduler.$schedulerWindow.addClass('visible');
        }, () => {
            console.error("An error occurred");
        });
    };

    static hide() {
        Utils.$mainSectionElt.removeClass('blur');
        ScriptScheduler.$schedulerWindow.removeClass('visible');
        ScriptScheduler.hideCreationForm();
        ScriptScheduler.resetForm();
    };

    static refresh(): Promise<any> { // Refresh events & effects list

        const p1 = new Promise((resolve, reject) => {
            Utils.getEffectsList(false).then((effects) => {
                ScriptScheduler.createEffectList(effects);
                resolve();
            }, () => {
                reject(null);
            });
        });

        const p2 = new Promise((resolve, reject) => {
            Utils.getScheduledEventsList(false).then((events) => {
                ScriptScheduler.createEventsList(events);
                resolve();
            }, () => {
                reject(null);
            });
        });

        Utils.showLoader();
        return new Promise((resolve, reject) => {
            Promise.all([p1, p2]).then(() => {
                Utils.hideLoader();
                resolve();
            }, () => {
                Utils.hideLoader();
                reject();
            })
        });
    }

    static createEffectList(effects) {
        $(ScriptScheduler.effectsList).find('option.fetched').remove();
        effects.forEach((effect) => {
            const $option = $('<option>');
            $option.text(effect.name);
            $option.attr('value', effect.id);
            $option.attr('class', 'fetched');
            $(ScriptScheduler.effectsList).append($option);
        });
    }

    static createEventsList(events) {
        ScriptScheduler.scheduledEvents = [];
        ScriptScheduler.clearEventsView();
        const d = new Date();
        ScriptScheduler.eventsPositionTracker = [];

        events.forEach((rawEvent) => {
            const config = JSON.parse(rawEvent.config);
            const effectId = rawEvent.effectId;
            const id = rawEvent.id;
            const weekDay = config.weekDay;
            const repeated = config.repeated;
            const event = new ScheduledEvent(
                (parseInt(config.timeStart) - (d.getTimezoneOffset())) % (60*24),
                effectId,
                weekDay,
                repeated,
                id
            );
            ScriptScheduler.scheduledEvents.push(event);
            ScriptScheduler.createEventView(event, rawEvent.effectName);
        });

    }

    static loadEventById(id: number){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/scheduler/'+id,
                contentType: 'application/json',
                type: "GET",
            }).done(function (data) {
                resolve(data);
            }).fail(function (e) {
                alert('An error occurred');
            }).always(function () {
            });
        });
    }

    static setEventToForm(event: ScheduledEvent) {

        ScriptScheduler.resetForm();
        $(ScriptScheduler.form).data('id', event.getId());

        $(ScriptScheduler.effectsList).val(event.effectId || '');
        $(ScriptScheduler.choiceChanger).val(isNaN(event.weekDay)?'repeated':'onetime').change();

        if(isNaN(event.weekDay) && event.repeated){
            event.repeated.forEach((val) => {
                (<HTMLInputElement>$(ScriptScheduler.repeatedForm).find('input[value="'+val+'"]')[0]).checked = true;
            });
        } else {
            $(ScriptScheduler.oneTimeWeeksDay).val(event.weekDay);
        }

        const hours = Math.floor((event.timeStart )/(60));
        const offsetHours = Math.floor((((event.timeStart) - (new Date().getTimezoneOffset())) % (60*24))/60);
        const minutes = (event.timeStart - (60 * hours));
        ScriptScheduler.hoursSelector.value = offsetHours;
        ScriptScheduler.minutesSelector.value = minutes;

    }

    static clearEventsView = () => {
        $(ScriptScheduler.calendar).find('.event').remove();
        $(ScriptScheduler.calendarList).find('.event').remove();
    };

    static createEventView = (event: ScheduledEvent, effectName: string) => {
        const eventWidthPercent = 20;
        let eventHeightPercent = ScriptScheduler.eventHeightPercent;

        const loadEventOnClick = (event) => {
            Utils.showLoader();
            ScriptScheduler.loadEventById(event.getId()).then((event: any) => {
                event.config = event.config;
                const scheduledEvent = ScheduledEvent.fromRow(event);
                ScriptScheduler.setEventToForm(scheduledEvent);
                ScriptScheduler.showCreationForm();
                Utils.hideLoader();
            }, (error) => {
                Utils.hideLoader();
            })
        };

        const create = (list, repeated = false,) => {
            const li = document.createElement('li');
            li.setAttribute('class', 'event' + (repeated?' repeated':'')+(effectName ? '':' off'));
            li.setAttribute('data-event-id', ''+event.getId());

            const hours = Math.floor((event.timeStart )/(60));
            const minutes = (event.timeStart - (60 * hours));
            let formattedTime = (hours<10?('0'+hours):hours)+':'+(minutes<10?('0'+minutes):minutes);

            const timeSpan = document.createElement('span');
            timeSpan.setAttribute('class', 'time');
            timeSpan.innerHTML = formattedTime;

            const effectNameSpan = document.createElement('span');
            effectNameSpan.setAttribute('class', 'name');
            effectNameSpan.innerHTML = (effectName || '<i class="fa fa-power-off"></i>');

            li.appendChild(timeSpan);
            li.appendChild(effectNameSpan);
            $(li).data('timeStart', event.timeStart);

            $(li).click(() => {
                loadEventOnClick(event);
            });
            $(li).mouseenter((e) => {
                $(ScriptScheduler.calendarList).find('[data-event-id="'+event.getId()+'"]').addClass('hover');
            });
            $(li).mouseleave((e) => {
                $(ScriptScheduler.calendarList).find('[data-event-id="'+event.getId()+'"]').removeClass('hover');
            });

            // At which position inserting the event
            const existingEvents = list.querySelectorAll('li.event');
            let inserted = false;
            if(existingEvents.length){
                for(let i = 0; i < existingEvents.length; i++) {
                    if(event.timeStart < parseInt($(existingEvents[i]).data('timeStart'))) {
                        $(existingEvents[i]).before(li);
                        inserted = true;
                        break;
                    }
                }
                if(!inserted) {
                    list.append(li);
                }
            } else {
                list.append(li);
            }
        };
        const currentPositionPercent = (event.timeStart / (60 * 24)) * 100;
        if (event.isOneTime()) {
            create(ScriptScheduler.getWeekDayLists()[event.weekDay], false);
        } else if (event.isRepeated) {
            const columns = ScriptScheduler.getWeekDayColumns(event.repeated);
            columns.forEach((column, index) => {
                const weekDay = event.repeated[index];
                create(
                    ScriptScheduler.getWeekDayLists()[event.repeated[index]], true);
            });
        }
    };


    private static getWeekDayColumns(weekDays: Array<number>): Array<any> {
        const days = ScriptScheduler.$schedulerWindow[0].querySelectorAll('.daytime');
        const ret = [];
        weekDays.forEach((weekDay) => {
            ret.push(days[weekDay]);
        });
        return ret;
    };

    private static getWeekDayLists(): Array<any> {
        return ScriptScheduler.calendarList.querySelectorAll('ul.day-list');
    };

    private static createNewScheduledEvent() {
        const isRepeated = ScriptScheduler.choiceChanger.value !== 'onetime';
        const effectId = (<HTMLSelectElement>ScriptScheduler.scheduleForm.querySelector("#effect-name")).value;
        const repeatedDays = [];
        if (isRepeated) {
            (<any>ScriptScheduler.repeatedForm.querySelectorAll('input[type="checkbox"]')).forEach((current) => {
                if (current.checked) {
                    repeatedDays.push(parseInt(current.getAttribute('value')));
                }
            });

        }
        const days = isRepeated ? repeatedDays:ScriptScheduler.oneTimeWeeksDay.value;
        const hours = parseInt(ScriptScheduler.hoursSelector.value);
        const minutes = parseInt(ScriptScheduler.minutesSelector.value);


        if(!days || !days.length){
            alert("The event should run at least one day");
            return;
        }

        const d = new Date();
        const data: any = {
            effectId: effectId,
            config: JSON.stringify({
                timeStart: (((hours * 60 + minutes) || 0) + d.getTimezoneOffset())%(60*24),
                weekDay: isRepeated?NaN:days,
                repeated: isRepeated?days:null
            })
        };

        const editMode = $(ScriptScheduler.form).data('id');

        // Post then resetForm & refresh
        $(ScriptScheduler.btnAddEvent).attr('disabled', 'disabled');
        try {
            const id = editMode?$(ScriptScheduler.form).data('id'):null;
            const url = '/scheduler' + (id ? ('/' + id) : '');
            const method = editMode ? 'PUT' : 'POST';
            $.ajax({
                url: url,
                contentType: 'application/json',
                type: method,
                data: JSON.stringify(data)
            }).done(function () {
                ScriptScheduler.refresh().then(() => {
                    ScriptScheduler.hideCreationForm();
                    ScriptScheduler.resetForm();
                });
            }).fail(function (e) {
                alert(e.responseJSON.message);
            }).always(function () {
                $(ScriptScheduler.btnAddEvent).removeAttr('disabled');
            });
        }
        catch (e) {
            alert(e);
            $(ScriptScheduler.btnAddEvent).removeAttr('disabled');
            return;
        }
        $(ScriptScheduler.btnAddEvent).removeAttr('disabled');
        return false;
    }

    static removeScheduledEvents(id: number){
        Utils.showLoader();
        $.ajax({
            url: '/scheduler/'+id,
            type: 'DELETE'
        }).done(() => {
            ScriptScheduler.hideCreationForm();
            ScriptScheduler.refresh().then(() => {
            });
        }).fail(() => {
            alert('An error occurred');
            Utils.hideLoader();
        });
    }

    static resetForm() {
        $(ScriptScheduler.form).data('id', null);
        $.each($(ScriptScheduler.scheduleForm).find('select'), (i, elt) => {
            $(elt).val($(elt).find('>option').first().attr('value'));
            $(elt).trigger('change');
        });
        $.each($(ScriptScheduler.scheduleForm).find('[type=checkbox]'), (i, elt) => {
            (<any>elt).checked = false;
        });
    };
}