import ScripManager from './ScriptManager';
import ScriptScheduler from './ScriptScheduler';
import Utils from './Utils';

var define = define || undefined;
var module = module || undefined;

export default class ScriptMain{
    static init(){
        Utils.init();
        ScripManager.init();
        ScriptScheduler.init();
    }
}

(function () {
    ScriptMain.init();
})();