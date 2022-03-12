// "re" will return true, if email is valid
const re =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateEmails = emails => {
  const emailArr = emails.split(',').map(email => email.trim());

  const invalidEmails = emailArr.filter(email => {
    return re.test(email) === false;
  });

  if (invalidEmails.length) return `These emails are invalid: ${invalidEmails}`;
};

export default validateEmails;
