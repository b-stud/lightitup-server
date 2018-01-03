/**
 * A handler the WS2801 Light Strip
 */
import PythonGenericHandler from '../../PythonGenericHandler';

const path = require('path');

export default class WS2801Handler extends PythonGenericHandler {

    public static driver_name = 'WS2801_Python_Driver';
    public scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/WS2801');
    public scriptName = 'WS2801_handler.py';

}