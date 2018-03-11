const request = require('request');

const timeout = 4000;

export default class NetworkForwarder {

    constructor(public hostsList: Array<string>) {
    }

    stack(config: any, timeLimit: number, priority: number) {
        let options = {
            method: 'POST',
            uri: '',
            timeout: timeout,
            json: {
                config: config,
                timeLimit: timeLimit,
                priority: priority
            }
        };

        for (let host of this.hostsList) {
            options.uri = host + "/stack?_forwarded=1";
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                } else {
                }
            }, () => {
            });
        }
    }

    unstack(minPriority, maxPriority) {
        let options = {
            method: 'POST',
            uri: '',
            timeout: timeout,
            json: {
                priority_min: minPriority,
                priority_max: maxPriority,
            }
        };

        for (let host of this.hostsList) {
            options.uri = host + "/unstack?_forwarded=1";
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                } else {
                }
            }, () => {
            });
        }
    }

    toggle() {
        let options = {
            method: 'POST',
            uri: '',
            timeout: timeout,
            json: {}
        };

        for (let host of this.hostsList) {
            options.uri = host + "/toggle?_forwarded=1";
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                } else {
                }
            }, () => {
            });
        }
    }

    reset() {
        let options = {
            method: 'POST',
            uri: '',
            timeout: timeout,
            json: {}
        };

        for (let host of this.hostsList) {
            options.uri = host + "/reset?_forwarded=1";
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                } else {
                }
            }, () => {
            });
        }
    }

}