import Utils from './Utils';
import * as $ from 'jquery';
import * as Mustache from 'mustache';

export default class ScriptManager {
    static init()
    {
        $(document).ready(() => {
            const template = "<li data-id=\"{{ id }}\">\n" +
                "            <div class=\"btn-gloss btn-gloss-black description-btn no-padding\">\n" +
                "                <div class='data'>" +
                "                   <div class='name'>{{ name }}</div>" +
                "                </div>\n" +
                "                <div class=\"controls\">\n" +
                "                   <div>\n" +
                "                       <button class='edit'><i class=\"fa fa-pencil\"></i></button>\n" +
                "                   </div>\n" +
                "                   <div>\n" +
                "                       <button class='remove'><i class=\"fa fa-times\"></i></button>\n" +
                "                   </div>\n" +
                "                 </div>\n" +
                "            </div>\n" +
                "        </li>";

            const $listElt = $("ul#effects-list");
            const $modalElt = $("section#modal");
            const $colorPickerWindow = $("section#color-picker");
            const $btnCreateNew = $("button#create");
            const $btCloseModal = $modalElt.find("div.close");
            const $btnSave = $modalElt.find("button#saveBtn");
            const $btnCancel = $modalElt.find("button#cancel");
            const $resetBtn = $("#reset");
            const $colorPickerBtn = $("#btncolorpicker");
            const form = <HTMLFormElement>$("#effect-form")[0];
            const canvas = <HTMLCanvasElement>$(".canvas-wrapper > canvas")[0];
            const $btnWhiteCanvas = $("#btnWhiteCanvas");
            const $btnColorCanvas = $("#btnColorCanvas");
            const $btnCloseColorPicker = $("#closeColorPicker");
            const $pickerCtrl = $("#picker-ctrl");
            const $previewColorElt = $("#preview-color");
            const persistentEffectsClass = "persistent";



            const clearList = () => {
                $listElt.find('> li:not(.' + persistentEffectsClass + ')').remove();
            };


            ['mousemove', 'touchmove'].forEach((event) => {
                $modalElt.on(event, (e) => {  //Prevent mobile devices to scroll the content behind
                    e.preventDefault();
                });
            });

            const showModal = (id = NaN, effect = null) => {
                if (id && effect) {
                    $btnSave.data('id', id);
                    //Fill fields
                    $modalElt.find('input[name="name"]').val(effect.name);
                    $modalElt.find('textarea[name="config"]').val(JSON.stringify(JSON.parse(effect.config), null, 2));
                    $modalElt.find('input[name="priority"]').val(effect.priority);
                    $modalElt.find('input[name="timeLimit"]').val(effect.timelimit);
                } else {
                    $btnSave.data('id', null);
                    form.reset();
                }
                Utils.$mainSectionElt.addClass('blur');
                $modalElt.addClass('visible');
            };

            const hideModal = () => {
                Utils.$mainSectionElt.removeClass('blur');
                $modalElt.removeClass('visible');
            };

            const refreshEffectsList = () => {
                // Utils.showLoader();
                Utils.getEffectsList().then((data) => {
                    clearList();
                    data.forEach(function (effect) {
                        const elt = Mustache.render(template, {
                            id: effect.id,
                            name: effect.name
                        });
                        const $elt = $(elt);
                        $elt.data('effect', effect);
                        bindItemClick($elt);
                        bindRemoveBtn($elt);
                        bindEditBtn($elt);
                        $listElt.append($elt);
                    });
                    // hideLoader();
                }, () => {
                    // hideLoader();
                });
            };

            $btnCreateNew.click(() => {
                showModal();
            });

            $btCloseModal.click(() => {
                hideModal();
            });

            const bindItemClick = ($elt) => {
                $elt.click(function (e) {
                    if ($elt.hasClass('disabled')) return;
                    $elt.addClass('disabled');
                    const effect = $elt.data("effect");
                    e.preventDefault();
                    e.stopPropagation();
                    $elt.attr('disabled', 'disabled');
                    $elt.find('button').attr('disabled', 'disabled');
                    $.ajax({
                        url: '/manager/apply/' + effect.name,
                        type: 'POST'
                    }).done(() => {
                    }).fail((e) => {
                        alert(e.responseJSON.message);
                    }).always(() => {
                        $elt.find('button').removeAttr('disabled');
                        $elt.removeClass('disabled');
                    })
                });
            };

            const bindRemoveBtn = ($elt) => {
                const btn = $elt.find('button.remove');
                btn.click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const ask = window.confirm("Would you really like to remove this effect?");
                    if (!ask) return;
                    $elt.addClass('removing');
                    $elt.find('button').attr('disabled', 'disabled');
                    $.ajax({
                        url: '/manager/' + $elt.attr('data-id'),
                        type: 'DELETE'
                    }).done(() => {
                        $elt.remove();
                    }).fail(() => {
                    }).always(() => {
                        $elt.find('button').removeAttr('disabled');
                    })
                });
            };
            const bindEditBtn = ($elt) => {
                const btn = $elt.find('button.edit');
                btn.click((e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showModal($elt.attr('data-id'), $elt.data('effect'));
                });
            };

            $btnCancel.click(() => {
                hideModal();
            });

            $btnSave.click((e) => {
                e.preventDefault();
                const $this = $(this);
                $this.attr('disabled', 'disabled');
                const data = Utils.objectifyForm(form);
                try {
                    const id = $btnSave.data('id');
                    const url = '/manager' + (id ? ('/' + id) : '');
                    const method = id ? 'PUT' : 'POST';
                    checkForm(data);
                    $.ajax({
                        url: url,
                        contentType: 'application/json',
                        type: method,
                        data: JSON.stringify(data)
                    }).done(function () {
                        hideModal();
                        refreshEffectsList();
                    }).fail(function (e) {
                        alert(e.responseJSON.message);
                    }).always(function () {
                        $this.removeAttr('disabled');
                    });
                }
                catch (e) {
                    alert(e);
                    $this.removeAttr('disabled');
                    return;
                }
                $this.removeAttr('disabled');
                return false;
            });

            $resetBtn.click(() => {
                if ($resetBtn.hasClass('disabled')) return;
                $resetBtn.addClass('disabled');
                $.ajax({
                    url: '/reset',
                    contentType: 'application/json',
                    type: 'POST'
                }).done(() => {
                }).fail(() => {
                    alert('An error occurred');
                }).always(() => {
                    $resetBtn.removeClass('disabled');
                });
            });


            const showColorPicker = () => {
                Utils.$mainSectionElt.addClass('blur');
                $colorPickerWindow.addClass('visible');
            };

            const hideColorPicker = () => {
                Utils.$mainSectionElt.removeClass('blur');
                $colorPickerWindow.removeClass('visible');
            };


            const modes = {WHITE: 0, COLOR: 1};
            let mode = modes.COLOR;
            $colorPickerBtn.click(() => {
                showColorPicker();
                updateCanvas();
            });
            const setActive = ($elt) => {
                $btnWhiteCanvas.removeClass('active');
                $btnColorCanvas.removeClass('active');
                $elt.addClass('active');
            };
            $btnWhiteCanvas.click(() => {
                mode = modes.WHITE;
                updateCanvas();
                setActive($btnWhiteCanvas);
            });
            $btnColorCanvas.click(() => {
                mode = modes.COLOR;
                updateCanvas();
                setActive($btnColorCanvas);
            });
            $btnCloseColorPicker.click(() => {
                hideColorPicker();
            });

            const relativePositionFormUserEvent = (e) => {
                let x = NaN, y = NaN;
                const rect = canvas.getBoundingClientRect();
                switch (e.type) {
                    case "touchstart":
                    case "touchmove":
                        x = e.changedTouches[0].clientX - rect.left;
                        y = e.changedTouches[0].clientY - rect.top;
                        break;
                    case "mousedown":
                    case "mousemove":
                        x = e.clientX - rect.left;
                        y = e.clientY - rect.top;
                        break;
                }
                return {x: x, y: y};
            };
            let colorPickerUserDown = false;
            ['mousedown', 'touchstart'].forEach((event) => {
                $pickerCtrl.get(0).addEventListener(event, (e) => {
                    const position = relativePositionFormUserEvent(e);
                    colorPickerUserDown = true;
                    pickColor(position.x, position.y);
                });
            });
            ['mouseup', 'touchend'].forEach(() => {
                $pickerCtrl.get(0).addEventListener('mouseup', () => {
                    colorPickerUserDown = false;
                });
            });
            ['mouseleave', 'touchleave'].forEach((event) => {
                $pickerCtrl.get(0).addEventListener(event, () => {
                    colorPickerUserDown = false;
                });
            });
            ['mousemove', 'touchmove'].forEach((event) => {
                $pickerCtrl.get(0).addEventListener(event, (e) => {
                    e.preventDefault(); //Prevent mobile devices to scroll the content behind
                    if (colorPickerUserDown) {
                        const position = relativePositionFormUserEvent(e);
                        pickColor(position.x, position.y);
                    }
                });
            });

            const pickerSize = parseInt($pickerCtrl.find('>div').css('fontSize'));
            const pickColor = (x, y) => {
                const c = canvas.getContext('2d');
                const p = c.getImageData(x, y, 1, 1).data;
                const color = [p[0], p[1], p[2]];
                sendSimpleColor(color, 100, x, y);
            };

            let lastRequestTime = NaN;
            const sendSimpleColor = (color, delay, x, y) => {
                const time = new Date().getTime();
                if (!isNaN(lastRequestTime) && time < lastRequestTime + delay) {
                    return;
                }
                $pickerCtrl.find('>div').css({'left': (x - pickerSize / 2) + 'px', 'top': (y - pickerSize / 2) + 'px'});
                const hex = "#" + ("000000" + Utils.rgbToHex(color[0], color[1], color[2])).slice(-6);
                $colorPickerBtn.find('>div').css({'background': hex, 'borderColor': hex});
                $previewColorElt.css('background', hex);
                $.ajax({
                    type: 'POST',
                    url: '/stack',
                    data: {
                        timeLimit: null,
                        priority: 0,
                        config: [{
                            "name": "simple-color",
                            "options": {
                                "activated": true,
                                "delay": 0,
                                "duration": 3000,
                                "waitAtEnd": 0,
                                "repeat": "",
                                "color": color
                            }
                        }]
                    }
                });
                lastRequestTime = time;
            };

            const updateCanvas = () => {
                const ctx = canvas.getContext("2d");
                canvas.width = $(canvas).parent().innerWidth();
                canvas.height = $(canvas).parent().innerHeight();
                let grd = null;
                switch (mode) {
                    case modes.WHITE:
                        // Create gradient
                        grd = ctx.createLinearGradient(0, canvas.height, canvas.width, canvas.height);
                        grd.addColorStop(0.00, 'rgba(255, 255, 255, 1.000)');
                        grd.addColorStop(1.000, 'rgba(180, 180, 0, 1.000)');
                        ctx.fillStyle = grd;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        grd = ctx.createLinearGradient(canvas.width, canvas.height, canvas.width, 0);
                        grd.addColorStop(0.000, 'rgba(0, 0, 0, 1.000)');
                        grd.addColorStop(0.830, 'rgba(255, 255, 255, 0)');
                        ctx.fillStyle = grd;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        break;
                    case modes.COLOR:
                        grd = ctx.createLinearGradient(0, canvas.height / 2, canvas.width, canvas.height / 2);
                        grd.addColorStop(0.000, 'rgba(255, 0, 0, 1.000)');
                        grd.addColorStop(0.150, 'rgba(255, 0, 255, 1.000)');
                        grd.addColorStop(0.330, 'rgba(0, 0, 255, 1.000)');
                        grd.addColorStop(0.490, 'rgba(0, 255, 255, 1.000)');
                        grd.addColorStop(0.670, 'rgba(0, 255, 0, 1.000)');
                        grd.addColorStop(0.840, 'rgba(255, 255, 0, 1.000)');
                        grd.addColorStop(1.000, 'rgba(255, 0, 0, 1.000)');
                        ctx.fillStyle = grd;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);


                        grd = ctx.createLinearGradient(canvas.width / 2, canvas.height, canvas.width / 2, 0);
                        grd.addColorStop(0.000, 'rgba(0, 0, 0, 1.000)');
                        grd.addColorStop(1.000, 'rgba(0, 0, 0, 0.000)');
                        ctx.fillStyle = grd;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        grd = ctx.createLinearGradient(canvas.width / 2, canvas.height, canvas.width / 2, 0);
                        grd.addColorStop(0.713, 'rgba(255, 255, 255, 0.000)');
                        grd.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
                        ctx.fillStyle = grd;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        break;
                }
            };

            $(window).on('resize', () => {
                updateCanvas();
            });


            updateCanvas();
            refreshEffectsList();
        });


        const checkForm = (data) => {
            if (!data.name.length) throw 'Name cannot be empty';
            let parsedConfig = null;
            try {
                parsedConfig = JSON.parse(data.config);
                if (!Array.isArray(parsedConfig)) {
                    Utils.triggerException();
                }
            }
            catch (e) {
                throw 'Not a valid JSON config';
            }
            parsedConfig.forEach(function (config) {
                ['name', 'options'].forEach((field) => {
                    if (!config.hasOwnProperty(field)) {
                        throw 'The configuration field must contain "name" and "config" keys';
                    }
                });
            });
            if (data.timeLimit != "" && isNaN(parseInt(data.timeLimit))) {
                throw 'Not a valid time limit, let empty to run the effect forever';
            }
        };

    }
}
