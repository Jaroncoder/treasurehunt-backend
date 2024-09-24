const mongoose = require('mongoose');

const Credential = require('./model/credential');
const Round = require('./model/round');

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
  const round1 = await Round.findOne({
    stageNumber: 0,
  }).exec();

  await Credential.updateMany({}, {
    round: round1._id,
  });

  console.log('successfully updated credentials');
}

async function main() {
  switch (process.argv[2]) {
    case 'populate-rounds':
      await populateRounds();
      break;

    case 'update-credentials':
      await updateCredentials();
      break;
    
    default:
      console.log('invalid argument');
  }
}

main().catch(err => console.error(err));
