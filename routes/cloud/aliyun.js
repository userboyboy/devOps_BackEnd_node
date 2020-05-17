var express = require('express');
var router = express.Router();
const aliClient = require('../../aliconfig')


/* GET cloud page. 获取域名列表*/
router.post('/domain/list', function (req, res, next) {

  var requestOption = {
    method: 'POST'
  };
  var params = {
    "RegionId": "cn-hangzhou",
    "PageNumber": req.body.params.PageNumber,
    "PageSize": req.body.params.PageSize,
    "KeyWord": req.body.params.KeyWord

  }
  console.log(params.KeyWord);

  aliClient.request('DescribeDomains', params, requestOption).then((result) => {
    console.log(JSON.stringify(result));
    res.send(result)
  }, (ex) => {
    res.send(ex);
  })
});

/* GET cloud page. 获取解析列表*/
router.post('/domain/dns', function (req, res, next) {

  var requestOption = {
    method: 'POST'
  };
  var params = {
    "RegionId": "cn-hangzhou",
    "DomainName": req.body.params.KeyWord
  }
  console.log(req.body.params.KeyWord);

  aliClient.request('DescribeDomainRecords', params, requestOption).then((result) => {
    console.log(JSON.stringify(result));
    res.send(result)
  }, (ex) => {
    res.send(ex);
  })
});



module.exports = router;
