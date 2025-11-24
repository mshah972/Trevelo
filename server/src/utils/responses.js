export const ok = (res, data) => res.json({ ok: true, ...data });
export const err = (res, status, message) => res.status(status).json({ ok: false, error: message });