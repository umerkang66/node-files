// __mocks__ should be in the same directory where the module is we want to mock
const mailer = { sendMail: jest.fn() };

export { mailer };
