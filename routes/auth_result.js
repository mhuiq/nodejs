/**
 * Created by 80374361 on 2017/1/19.
 */

var express = require('express');
var router = express.Router();
var ws = require('../websocket');
var certTokenManager = require('../lib/cert_token_manager');
var db = require('../lib/db_connection_factory');
var stringUtil = require('../lib/util/string_util');

router.get('/', function(req, res, next) {
  res.send('respond with auth_result');
});

router.options('/',function(req, res, next) {
 		console.log('auth_result options');
//		res.header('Access-Control-Allow-Origin', req.headers.origin);  
		res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');  
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');  
		res.status(200).end(); /*让options请求快速返回*/  
});

router.post('/', function (req, res,next) {
    var responseData = {};
	console.log("收到的数据:", req);
    var certToken = req.body.cert_token;
    if (typeof(certToken)=='undefined') {
		responseData.ret_code = '4021';
        responseData.error_msg = 'token未定义';
        res.send(JSON.stringify(responseData));
        return ;
    }
    var certTokenMap = certTokenManager.getCertTokenMap();
    var certTokenSubject = certTokenMap[certToken];
    if (typeof(certTokenSubject)=='undefined' || certTokenSubject.getToken().isAuthed) {
		responseData.ret_code = '4022';
		responseData.error_msg = 'token不可用';
		res.send(JSON.stringify(responseData));
		res.end();
		return ;
    }
    
    var fullName = req.body.full_name;
    var idNum = req.body.id_num;
    var certRes = req.body.cert_res;
    // TODO 将认证结果保存到数据库
    console.log("收到的认证结果为：" + certRes);
    var certMode = req.body.cert_mode;
    // 根据appId找到房屋Id，根据房屋id找到所有的授权用户信息
    var appId = certTokenSubject.getAppId();
    var sql = "select * from authdb.TAB_AUTH_INFO where HOUSEID = (select t1.houseid from TAB_DEV_INFO t1 where t1.APPID = ? and t1.RECORDSTATUS = 'Y') and IDCARD = ?";

	var clients = ws.getClients();
	var unLockResp = {};
    db.query(sql, [appId, idNum], function (authInfoRs) {
    		
			if (authInfoRs.length < 1) {
				// TODO 返回给认证服务器错误信息
				responseData.ret_code = '4101';
				responseData.error_msg = '身份认证结果不匹配';
				res.send(JSON.stringify(responseData));
				return;
			}
		    var buf = Buffer.alloc(4);
		    buf.write(certRes);
		    // TODO 1.根据认证服务器返回的认证模式进行认证；2.认证成功后，将cert_token对应的certToken对象设置为已验证状态，并且为该客户端重新申请密钥
		    // 0X40模式,只需比对第一字节(第二字节为’X’),如为0X42模式则需比较两字节；0X0F和0X4F需比较3个字节。
		    switch (certMode) {
		       case 0X40:
		       // TODO 认证姓名+身份证号码进行身份认证
		          if (String.fromCharCode(buf[0]) === 0 && String.fromCharCode(buf[1]) === 'X') {
						certTokenManager.authSuccess(certToken);
						unLockResp.opcode = 'CERTRES';
						unLockResp.id_num = idNum;
						unLockResp.full_name = fullName;
						console.log('app:',clients[appId]);
						clients[appId].send(JSON.stringify(unLockResp));
		          }
		          break;
		      case 0X42:
		      // TODO 姓名+身份证号码+人像进行身份认证
		          if (String.fromCharCode(buf[0]) === '0' && String.fromCharCode(buf[1]) === '0') {
		              certTokenManager.authSuccess(certToken);
		          }
		          break;
		      case 0X0F:
		      // TODO 使用DN＋网上副本＋人像进行身份认证
		          if (String.fromCharCode(buf[0]) === '0' && String.fromCharCode(buf[1]) === '0' && String.fromCharCode(buf[3]) === '0') {
		              certTokenManager.authSuccess(certToken);
		          }
		          break;
		      case 0X4F:
		      // TODO 使用姓名+身份证号码＋网上副本＋人像进行身份认证
		          if (String.fromCharCode(buf[0]) === '0' && String.fromCharCode(buf[1]) === '0' && String.fromCharCode(buf[3]) === '0') {
		              certTokenManager.authSuccess(certToken);
		          }
		          break;
		      default:
		      // TODO 不支持的认证模式
		          responseData.ret_code = '4102';
		          responseData.error_msg = '不支持的认证模式';
		          res.send(JSON.stringify(responseData));
		          return ;
		    }
			unLockResp.opcode = 'CERTRES';
			unLockResp.id_num = idNum;
			unLockResp.full_name = fullName;
			console.log('app:',clients[0]);
			clients[0].ws.send(JSON.stringify(unLockResp));
		    responseData.ret_code = '0';
		    responseData.error_msg = '认证成功';
		    res.send(JSON.stringify(responseData));
  	});
});

module.exports = router;
