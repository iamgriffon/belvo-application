export const formatError = (data, body, reason) => {
  const output = []

  if (data.length > 1) {
    const formatted = { ReqResponse: [ ...data ], ReqBody: body, reason: reason };
    output.push(formatted);
    return output;
  } else {
    const formatted = { ReqResponse: [{ ...data }], ReqBody: body, reason: reason }
    output.push(formatted);
    return output;
  };
}