export const apiError = (message: string, status = 400) =>
  Response.json({ error: message }, { status })

export const apiOk = (data: unknown, status = 200) =>
  Response.json(data, { status })
