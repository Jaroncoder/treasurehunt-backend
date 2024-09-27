const mongoose = require('mongoose');

const User = require('./model/users');
const Round = require('./model/round');
const GetPath = require('./model/paths');
const Leaderboard = require('./model/leaderboard');

const hints = require('./hints.json');

require('dotenv').config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL)
    .then(console.log('connected!'))
    .catch(err => console.error(err));

async function populateRounds() {
  for(let i = 0; i < 6; i++) {
    const round = new Round({
      name: `Round ${i + 1}`,
      stageNumber: i
    });
    await round.save();
  }

  const lastRound = new Round({
    stageNumber: 6,
    name: 'End',
  });
  await lastRound.save();

  console.log('Rounds successfully created');
}

async function updateCredentials() {
  await User.updateMany({}, {
    stage: 0,
  });

  console.log('successfully updated credentials');
}

async function getUsers() {
  const users = await User.find().exec();
  console.log(users);
}

async function getUsersWithPath(path) {
  const user = await User.findOne({path_number: path}).exec();
  console.log(user);
}

async function checkPath(path) {
  const Path = GetPath(path);
  const pathDetails = await Path.find().exec();
  console.log(pathDetails); 
}

async function resetLastRounds(path) {
  const user = await User.updateOne({path_number: path}, {
    last_round: [],
  }).exec();
  console.log(user);
}

async function setRound(path, round) {
  const user = await User.updateOne({ path_number: path }, {
    current_round: round,
  }).exec();
  console.log(user);
}

async function resetUser(path) {
  const Path = GetPath(path);

  const p = await Path.find({startTime: {$exists: true}}).exec();

  const res = await Promise.all([
    Path.updateMany({startTime: {$exists: true}}, {
      $unset: {startTime: ''},
    }).exec(),
    User.updateOne({path_number: path}, {
      last_round: [],
      current_round: '1A',
    }).exec(),
  ]);

  console.log(res);
}

async function getLeaderboard() {
  const leaderboard = await Leaderboard.find().sort({score: -1}).exec();
  console.log(leaderboard);
}

async function resetLeaderboard() {
  const res = await Leaderboard.deleteMany().exec();
  console.log(res);
}

async function updateHints(path) {
  const Path = GetPath(path);
  let rounds = Object.keys(hints);
  const requests = rounds.map(round => Path.updateOne({round}, {questionHint: hints[round]}).exec());
  const res = await Promise.all(requests);
  console.log(res);
}

async function main() {
  switch (process.argv[2]) {
    case 'populate-rounds':
      await populateRounds();
      break;

    case 'update-credentials':
      await updateCredentials();
      break;
    
    case 'get-users':
      if (process.argv[3]) {
        await getUsersWithPath(process.argv[3]);
        break;
      }

      await getUsers();
      break;

    case 'check-path':
      await checkPath(process.argv[3]);
      break;

    case 'reset-last':
      await resetLastRounds(process.argv[3]);
      break;
    
    case 'set-round':
      await setRound(process.argv[3], process.argv[4]);
      break;
    
    case 'reset-user':
      await resetUser(process.argv[3]);
      break;
    
    case 'get-leaderboard':
      await getLeaderboard();
      break;

    case 'reset-leaderboard':
      await resetLeaderboard();
      break;
    
    case 'update-hints':
      await updateHints(process.argv[3]);
      break;

    case 'update-all-question-hints':
      for (let i = 1; i <= 60; i++) {
        await updateHints(i.toString());
        console.log(i);
      }
      break;

    default:
      console.log('invalid argument');
  }
}

main().catch(err => console.error(err)).finally(() => mongoose.connection.close());
