const Telegraf = require("telegraf")
const axios = require("axios")
const math = require("mathjs")
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const bot = new Telegraf("645610024:AAGbQDm5sOytmpmsDG0xj8oAnHxvi3pyQC8")

bot.start(ctx => {
    ctx.reply('Selamat datang rekan...')
})

bot.hears('hi', ctx => {
    console.log(ctx.chat)
    ctx.reply(`hi juga ${ctx.chat.first_name}`)
})
bot.hears('meow', ctx => {
    axios.get('https://aws.random.cat/meow')
        .then(response => {
            ctx.replyWithPhoto(response.data.file)
        })
})

bot.command('pagi', ctx => {
    ctx.reply('pagi juga')
})

bot.command('hitung', ctx => {
    const val = ctx.message.text.substring(8)
    //console.log(ctx.message)
    ctx.reply(math.eval(val))
})

// bot.on('text', ctx => {
//     //console.log(ctx.message.text)
//     ctx.reply(ctx.message.text)
// })

async function omdbSearch (query = '') {
    const apiUrl = `http://www.omdbapi.com/?s=${query}&apikey=9699cca`
    const response = await axios.get(apiUrl)
    const json = await response.data
    const posters = (json.Search && json.Search) || []
    return posters.filter(({ Poster }) => Poster && Poster.startsWith('https://')) || []
  }

  bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
    console.log('inline')
    const posters = await omdbSearch(inlineQuery.query)
    const results = posters.map((poster) => ({
      type: 'photo',
      id: poster.imdbID,
      caption: poster.Title,
      description: poster.Title,
      thumb_url: poster.Poster,
      photo_url: poster.Poster
    }))
    return answerInlineQuery(results)
  })

bot.command('onetime', ({ reply }) =>
  reply('One time keyboard', Markup
    .keyboard(['/simple', '/inline', '/pyramid'])
    .oneTime()
    .resize()
    .extra()
  )
)
bot.command('custom', ({ reply }) => {
    return reply('Custom buttons keyboard', Markup
      .keyboard([
        ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
        ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
        ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
      ])
      .oneTime()
      .resize()
      .extra()
    )
  })

  bot.command('simple', (ctx) => {
    return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
      Markup.keyboard(['Coke', 'Pepsi'])
    ))
  })

const gameShortName = 'your-game'
const gameUrl = 'https://your-game.tld'

bot.launch()