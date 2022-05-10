module.exports.generateRandStr = function (length, type = 'mix') {
  let characters;
  if (type === 'mix') {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  } else if (type === 'numeric') {
    characters = '0123456789';
  } else if (type === 'mixIgnoreCase') {
    characters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
  }
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
