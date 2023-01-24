const { Hilipsum } = require('hili-lipsum')

// Random word generator
const hilipsum = new Hilipsum()
const wordCollection = hilipsum.lipsum(200).split(' ')

/**
 * Convert each word into a random non-English word
 * @param {String} HTMLString - Text that may or may not be wrapped in <li>, <p>, <span> HTML tags
 * @returns {String} Text containing random words that may or may not be wrapped in <li>, <p>, <span> HTML tags
 */
module.exports.randomWords = (HTMLString) => {
  const words = HTMLString.match(/\w+[^<>,ul,li,span,<p>"]/g)
  let tempStr = HTMLString

  const MIN_INDEX = 0
  const MAX_INDEX = 190

  if (words) {
    words.forEach(word => {
      const min = MIN_INDEX
      const max = MAX_INDEX
      const index = Math.floor(Math.random() * (max - min + 1) + min)
      tempStr = tempStr.replace(word.trim(), wordCollection[index] || wordCollection[0])
    })
  }

  return tempStr
}
