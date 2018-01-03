import * as $ from 'jquery';

export default class Utils {

    static $mainSectionElt;

    static getEffectsList(manageLoader: boolean = false): Promise<Array<any>> {
        if(manageLoader) Utils.showLoader();
        return new Promise<Array<any>>((resolve, reject) => {
            $.getJSON('/manager/list').done((data) => {
                if(manageLoader) Utils.hideLoader();
                if (data instanceof Array) {
                    resolve(data);
                } else {
                    reject([]);
                }
            }).fail((err) => {
                reject(err);
                if(manageLoader) Utils.hideLoader();
            });
        });
    };

    static getScheduledEventsList(manageLoader: boolean = false): Promise<Array<any>> {
        if(manageLoader) Utils.showLoader();
        return new Promise<Array<any>>((resolve, reject) => {
            $.getJSON('/scheduler/list').done((data) => {
                if(manageLoader) Utils.hideLoader();
                if (data) {
                    resolve(data);
                } else {
                    reject([]);
                }
            }).fail((err) => {
                reject(err);
                if(manageLoader) Utils.hideLoader();
            });
        });
    };

    static triggerException(msg: string = ''): void {
        throw msg || '';
    }

    static rgbToHex = (r, g, b) => {
        return ((r << 16) | (g << 8) | b).toString(16);
    };

    static showLoader(){
        $("div.loader-wrapper").addClass('visible');
    };

    static hideLoader(){
        $("div.loader-wrapper").removeClass('visible');
    };

    static init(){
        Utils.$mainSectionElt = $("section#main")
    }

    static objectifyForm(formArray) {//serialize data function
        const returnArray = {};
        for (let i = 0; i < formArray.length; i++) {
            if (formArray[i].nodeName != "BUTTON")
                returnArray[formArray[i]['name']] = $.trim(formArray[i]['value']);
        }
        return returnArray;
    }

}