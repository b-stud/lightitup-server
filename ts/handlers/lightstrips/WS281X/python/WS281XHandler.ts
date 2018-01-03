/**
 * A handler WS281X Light Strips
 */
import PythonGenericHandler from '../../PythonGenericHandler';

const path = require('path');

export default class WS281XHandler extends PythonGenericHandler {

    public static driver_name = 'WS281X_Python_Driver';
    public scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/WS281X');
    public scriptName = 'WS281X_handler.py';
}