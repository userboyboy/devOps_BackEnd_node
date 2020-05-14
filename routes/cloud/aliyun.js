var express = require('express');
var router = express.Router();
const aliClient = require('../../aliconfig')


/* GET cloud page. */
router.get('/domain', function (req, res, next) {

  var requestOption = {
    method: 'POST'
  };
  var params = {
    "RegionId": "cn-hangzhou",
  }

  aliClient.request('DescribeDomains', params, requestOption).then((result) => {
    console.log(JSON.stringify(result));
    res.send(result)
  }, (ex) => {
    console.log(ex);
  })

});

module.exports = router;
