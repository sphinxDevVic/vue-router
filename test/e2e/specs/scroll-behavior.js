module.exports = {
  'scroll behavior': function (browser) {
    browser
    .url('http://localhost:8080/scroll-behavior/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 5)
      .assert.containsText('.view', 'home')

      .execute(function () {
        window.scrollTo(0, 100)
      })
      .click('li:nth-child(2) a')
      .assert.containsText('.view', 'foo')
      .execute(function () {
        window.scrollTo(0, 200)
        window.history.back()
      })
      .assert.containsText('.view', 'home')
      .assert.evaluate(function () {
        return window.pageYOffset === 100
      }, null, 'restore scroll position on back')

      // with manual scroll restoration
      // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
      .execute(function () {
        window.scrollTo(0, 100)
        history.scrollRestoration = 'manual'
      })
      .click('li:nth-child(2) a')
      .assert.containsText('.view', 'foo')
      .execute(function () {
        window.scrollTo(0, 200)
        window.history.back()
      })
      .assert.containsText('.view', 'home')
      .assert.evaluate(function () {
        return window.pageYOffset === 100
      }, null, 'restore scroll position on back with manual restoration')
      .execute(function () {
        history.scrollRestoration = 'auto'
      })

      // scroll on a popped entry
      .execute(function () {
        window.scrollTo(0, 50)
        window.history.forward()
      })
      .assert.containsText('.view', 'foo')
      .assert.evaluate(function () {
        return window.pageYOffset === 200
      }, null, 'restore scroll position on forward')

      .execute(function () {
        window.history.back()
      })
      .assert.containsText('.view', 'home')
      .assert.evaluate(function () {
        return window.pageYOffset === 50
      }, null, 'restore scroll position on back again')

      .click('li:nth-child(3) a')
      .assert.evaluate(function () {
        return window.pageYOffset === 0
      }, null, 'scroll to top on new entry')

      .click('li:nth-child(4) a')
      .assert.evaluate(function () {
        return document.getElementById('anchor').getBoundingClientRect().top < 1
      }, null, 'scroll to anchor')

      .click('li:nth-child(5) a')
      .assert.evaluate(function () {
        return document.getElementById('anchor2').getBoundingClientRect().top < 101
      }, null, 'scroll to anchor with offset')
      .end()
  }
}
