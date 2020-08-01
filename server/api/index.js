const TDAmeritrade = require('../libs/TDAmeritrade')
const router = require('express').Router()
module.exports = router

router.get('/auth', (req, res, next) => TDAmeritrade.storeToken(req, res));
router.use('/server', require('./server'));
router.use('/ameritrade', require('./ameritrade'));
router.get('/projects', (req, res, next) => {
  try {
      res.json({
        type: 'projects',
        payload: [
          {
            name: 'ELevel+: React Native - ReactN - React Native Bluetooth LE:',
            year: 2020,
            image: 'assets/images/2020.4.3-AccuAir.jpg',
            href: 'https://github.com/bryanstevens314',
            description:`Developed by myself and 2 others as part of a
            contract; the app connects and communicates with AccuAir's bluetooth module to receive, display and update real
            time height and position indicators as well as a handful of diagnostic feedback. Core to the app is this ability to
            update the 4 pieces of AccuAir's firmware stack through a chunked OTA update process.`
          },
          {
            name: 'PetGo: .Net - Entity Framework - Angular - Docker',
            year: 2019,
            image: '',
            href: 'https://github.com/petgp/PetGo',
            description:`Developed by myself and 2 other computer science
            majors; Angular/ Typescript along with Bootstrap were used to build the front end, this then communicates with
            our REST API built using ASP.NET. This is then packaged into a Docker container for seamless deployment to
            Heroku.`
          },
          {
            name: 'Coin Crusade: C# - Mapbox API – Google Cardboard',
            year: 2019,
            image: '',
            href: 'hhttps://coincrusade.herokuapp.com/',
            description:`A VR experience built my myself and a team of 3
            others using Unity with the ability to deploy cross platform to iOS and Android as well as others. Users are able to
            create and join matches with each other and run around Time Square collecting coins.`
          },
          {
            name: 'Stack Chat: NodeJS - SocketIO - React',
            year: 2018,
            image: '',
            href: 'https://stack-chatter.herokuapp.com/',
            description:`Application was built as a pair programming exercise alongside a
            fellow Fullstack Alumni enabling users to create accounts, establish rooms and message in real time.`
          },
          {
            name: 'Bitcoin Faucet: Objective-C',
            year: 2016,
            image: '',
            href: '',
            description:`: The app utilized multiple ad networks to mediate advertisements; that coupled
            with persistent timestamps, small amounts of a Bitcoin were dished out to users for viewing ads. The app was live
            for several months with over 4.2K total downloads and over 230,000 sessions.`
          },
          {
            name: 'Love Story Project: Objective-C - AVFoundation – GoogleAPI:',
            year: 2015,
            image: '',
            href: '',
            description:`Developed for a client; the application recorded
            video using an iPad's front facing camera, collected user information then uploaded videos to YouTube using Google's API.`
          },
        ]
      })
  } catch (err) {
    next(err)
  }
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})