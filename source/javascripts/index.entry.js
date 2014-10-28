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

function makeChatlogAnonymous(logs) {
  var container = $('<div>')
    , getLogName = createGetLogName(anonymousNames)
  $.each(logs, function(idx, log) {
    var para = $('<p>')
    para.text('【' + getLogName(log.name) + '】：'
      + log.content)
    container.append(para)
  })
  return container.html()
}


$(function() {
  var logInput = $('.chatlog-input')
    , anonymousContainer = $('.anonymous-chatlog')

  function logInputChanged(e) {
    var val = logInput.val()
    try {
      var chatlogResult = chatlog(val)
    } catch (e) {
      return anonymousContainer
        .text('发生了奇怪的错误')
    }
    anonymousContainer
      .html(makeChatlogAnonymous(chatlogResult && chatlogResult.logs))

  }

  logInput.on('input', logInputChanged)
  logInputChanged()
})