/**
 * A handler the LPD8806 Light Strip
 */
import PythonGenericHandler from '../../PythonGenericHandler';

const path = require('path');

export default class LPD8806Handler extends PythonGenericHandler {

    public static driver_name = 'LPD8806_Python_Driver';
    public scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/LPD8806');
    public scriptName = 'LPD8806_handler.py';

}