var chatlog = require('chatlog')
  , $ = require('jquery')
  , _ = require('underscore')

var anonymousNames = [
  'A', 'B', 'C', 'D', 'E', 'F'
]

function createGetLogName(anonymousNames) {
  var nameDict = {}
    , anonymousNamesIndex = 0
    , anonymousNamesLength = anonymousNames.length

  return function (name) {
    if (!_.has(nameDict, name)) {
      var nameCycle = Math.floor(anonymousNamesIndex / anonymousNamesLength)
        , nameSuffix = nameCycle  ? nameCycle + '号' : ''

      nameDict[name] =
        anonymousNames[anonymousNamesIndex % anonymousNamesLength]
        + nameSuffix

      anonymousNamesIndex ++
    }
    return nameDict[name]
  }
}

function makeChatlogFormat(logs, options) {
  var container = $('<div>')
    , getLogName = createGetLogName(anonymousNames)
  $.each(logs, function(idx, log) {
    var para = $('<p>')
      , logName = options.anonymous ? getLogName(log.name) : log.name
    para.text('【' + $.trim(logName) + '】：'
      + log.content)
    container.append(para)
  })
  return container.html()
}


$(function() {
  var logInput = $('.chatlog-input')
    , anonymousContainer = $('.anonymous-chatlog')
    , anonymousCheckbox = $('input[name=anonymous]')
    , options = { anonymous: anonymousCheckbox.prop('checked') }
  console.log(anonymousCheckbox)

  function logInputChanged(e) {
    var val = logInput.val()
    try {
      var chatlogResult = chatlog(val)
    } catch (e) {
      return anonymousContainer
        .text('发生了奇怪的错误')
    }
    anonymousContainer
      .html(makeChatlogFormat(chatlogResult && chatlogResult.logs
        , options))

  }

  anonymousCheckbox.change(function() {
    options.anonymous = anonymousCheckbox.prop('checked')
    logInputChanged()
  })

  logInput.on('input', logInputChanged)
  logInputChanged()
})