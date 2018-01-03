/**
 * A handler the P9813 Light Strip
 */
import PythonGenericHandler from '../../PythonGenericHandler';

const path = require('path');

export default class P9813Handler extends PythonGenericHandler {

    public static driver_name = 'P9813_Python_Driver';
    public scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/P9813');
    public scriptName = 'P9813_handler.py';

}