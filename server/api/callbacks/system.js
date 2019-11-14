// Helper for return answer on JSON API standart
import answerBuilder from '../../helpers/answerBuilder';

/**
 * @function
 * @name checkHealth
 * @description Function return JSON API answer standart for check
 * server health
 * @param {object} req requeset express object  
 * @param {object} res responce express object
 * @returns retrne answer on JSON API standart
 * @export
 */
export function checkHealth(req, res) {
    const message = 'Health check';
    const meta = { message };
    answerBuilder(res, undefined, undefined, meta);
}