export default function answerBuilder(res, d, e, m, code) {
    let data, errors, meta;
    if (d) {
        data = Array.isArray(d) ? d : [d];
    } else {
        data = [];
    }
    if (e) {
        errors = Array.isArray(e) ? e : [e];
    } else {
        errors = [];
    }
    meta = m ? m : {};

    if (code) {
        return res.status(code).json({ data, errors, meta });
    } else {
        return res.json({ data, errors, meta });
    }
}