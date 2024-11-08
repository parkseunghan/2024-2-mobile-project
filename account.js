const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = '';

bcrypt.hash(password, saltRounds, function(err, hash) {
    console.log('해시된 비밀번호:', hash);
});