exports.getAllUsers = (req, res) => {
  res.send('Users');
};

exports.getUser = (req, res) => {
  res.send('getting user');
};

exports.createUser = (req, res) => {
  res.send('User creating...');
};

exports.updateUser = (req, res) => {
  res.send('Updating...');
};

exports.deleteUser = (req, res) => {
  res.send('deleting...');
};
