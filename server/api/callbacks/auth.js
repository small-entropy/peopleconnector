import answerBuilder from '../../helpers/answerBuilder';
import buildMeta from '../../helpers/buildMeta';
import sbisAuth from '../../helpers/sbisAuth';

export function logout(req, res) {
    const meta = buildMeta(req);
    meta.message = 'Выход успешно выполнен';
    answerBuilder(res, undefined, undefined, meta);
}

export async function login(req, res) {
    const { login, password } = req.body;
    const answer = await sbisAuth(login, password);
}