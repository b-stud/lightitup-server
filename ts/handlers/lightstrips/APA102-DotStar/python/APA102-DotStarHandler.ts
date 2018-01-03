/**
 * A handler for DotStar Light Strips
 */
import PythonGenericHandler from '../../PythonGenericHandler';

const path = require('path');

export default class APA102_DotStarHandler extends PythonGenericHandler {

    public static driver_name = 'APA102-DotStar_Python_Driver';
    public scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/APA102-DotStar');
    public scriptName = 'APA102-DotStar_handler.py';
}