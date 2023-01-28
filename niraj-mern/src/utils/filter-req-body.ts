interface AnyRequestBody {
  [key: string]: string;
}

function filterReqBody(
  reqBody: AnyRequestBody,
  ...allowedFields: string[]
): AnyRequestBody {
  const newObj: AnyRequestBody = {};

  for (const key in reqBody) {
    if (allowedFields.includes(key)) {
      newObj[key] = reqBody[key];
    }
  }

  return newObj;
}

export { filterReqBody, type AnyRequestBody };
