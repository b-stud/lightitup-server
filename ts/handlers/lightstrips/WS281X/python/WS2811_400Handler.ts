/**
 * A handler WS281X 400khz Light Strips
 */
import PythonGenericHandler from '../../PythonGenericHandler';

const path = require('path');

export default class WS2811_400 extends PythonGenericHandler {

    public static driver_name = 'WS2811_400_Python_Driver';
    public scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/WS281X');
    public scriptName = 'WS2811_400_handler.py';

}