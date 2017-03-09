CREATE TABLE `TAB_AUTH_INFO` (
  `AUTHID` int(11) NOT NULL AUTO_INCREMENT COMMENT '授权ID',
  `IDCARD` char(32) NOT NULL COMMENT '用户ID',
  `HOUSEID` char(64) NOT NULL COMMENT '房屋ID',
  `SPC10` varchar(10) NOT NULL DEFAULT '' COMMENT '备用字段1',
  `SPC20` varchar(20) NOT NULL DEFAULT '' COMMENT '备用字段2',
  `SPC50` varchar(50) NOT NULL DEFAULT '' COMMENT '备用字段3',
  `SPC100` varchar(100) NOT NULL DEFAULT '' COMMENT '备用字段4',
  PRIMARY KEY (`AUTHID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='授权信息表';

CREATE TABLE `TAB_DEV_INFO` (
  `APPID` char(64) NOT NULL COMMENT '设备ID',
  `HOUSEID` char(64) NOT NULL COMMENT '房屋ID',
  `APPINFO` varchar(255) NOT NULL DEFAULT '' COMMENT '设备信息',
  `REGISTERTIME` char(16) NOT NULL COMMENT '设备注册时间',
  `MOBILEPHONE` char(16) NOT NULL DEFAULT '' COMMENT '联系电话',
  `RECORDSTATUS` char(1) NOT NULL DEFAULT 'Y' COMMENT '记录状态',
  `SPC10` varchar(10) NOT NULL DEFAULT '' COMMENT '备用字段1',
  `SPC20` varchar(20) NOT NULL DEFAULT '' COMMENT '备用字段2',
  `SPC50` varchar(50) NOT NULL DEFAULT '' COMMENT '备用字段3',
  `SPC100` varchar(100) NOT NULL DEFAULT '' COMMENT '备用字段4',
  PRIMARY KEY (`APPID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='设备信息表';

CREATE TABLE `TAB_HOUSE_INFO` (
  `HOUSEID` char(32) NOT NULL COMMENT '房屋ID',
  `HOUSEINFO` varchar(255) NOT NULL COMMENT '房屋信息',
  `SCHEMEID` int(11) NOT NULL COMMENT '策略ID',
  `HOUSEADDR` varchar(255) NOT NULL COMMENT '房屋地址',
  `SPC10` varchar(10) NOT NULL DEFAULT '' COMMENT '备用字段1',
  `SPC20` varchar(20) NOT NULL DEFAULT '' COMMENT '备用字段2',
  `SPC50` varchar(50) NOT NULL DEFAULT '' COMMENT '备用字段3',
  `SPC100` varchar(100) NOT NULL DEFAULT '' COMMENT '备用字段4',
  PRIMARY KEY (`HOUSEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='房屋信息表';

CREATE TABLE `TAB_SCHEMA_INFO` (
  `SCHEMAID` int(11) NOT NULL AUTO_INCREMENT COMMENT '策略ID',
  `HOUSEID` char(32) NOT NULL COMMENT '房屋ID',
  `MODE` int(11) NOT NULL COMMENT '认证模式',
  `SCHEMASTARTTIME` char(32) NOT NULL COMMENT '策略生效时间',
  `SCHEMAENDTIME` char(32) NOT NULL COMMENT '策略失效时间',
  `SPC10` varchar(10) NOT NULL DEFAULT '' COMMENT '备用字段1',
  `SPC20` varchar(20) NOT NULL DEFAULT '' COMMENT '备用字段2',
  `SPC50` varchar(50) NOT NULL DEFAULT '' COMMENT '备用字段3',
  `SPC100` varchar(100) NOT NULL DEFAULT '' COMMENT '备用字段4',
  PRIMARY KEY (`SCHEMAID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='策略信息表';

CREATE TABLE `TAB_USER_INFO` (
  `IDCARD` char(32) NOT NULL COMMENT '用户ID',
  `USERNAME` varchar(128) NOT NULL COMMENT '用户姓名',
  `IMAGEPATH` varchar(255) NOT NULL DEFAULT '' COMMENT '图像地址',
  `MOBILEPHONE` char(16) NOT NULL COMMENT '联系电话',
  `SPC10` varchar(10) NOT NULL DEFAULT '' COMMENT '备用字段1',
  `SPC20` varchar(20) NOT NULL DEFAULT '' COMMENT '备用字段2',
  `SPC50` varchar(50) NOT NULL DEFAULT '' COMMENT '备用字段3',
  `SPC100` varchar(100) NOT NULL DEFAULT '' COMMENT '备用字段4',
  PRIMARY KEY (`IDCARD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表';

CREATE TABLE TAB_VISITORS_INFO (
	IDCARD CHAR(18) COMMENT '访客身份证号',
	USERNAME VARCHAR(255)  NOT NULL COMMENT '访客姓名',
	IMAGEPATH varchar(255) NOT NULL DEFAULT '' COMMENT '图像地址',
    MOBILEPHONE char(16) NOT NULL COMMENT '联系电话',
	HOUSEID VARCHAR(32) NOT NULL COMMENT '房屋ID',
	VALIDATETIME VARCHAR(16) NOT NULL COMMENT '生效时间',
	DURATION INTEGER NOT NULL COMMENT '有效时长（分钟）',
	SPC10 VARCHAR(10) DEFAULT '' NOT NULL COMMENT '备用字段1',
	SPC20 VARCHAR(20) DEFAULT '' NOT NULL COMMENT '备用字段2',
	SPC50 VARCHAR(50) DEFAULT '' NOT NULL COMMENT '备用字段3',
	SPC100 VARCHAR(100) DEFAULT '' NOT NULL COMMENT '备用字段4',
	PRIMARY KEY (`IDCARD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='访客信息表';

-- 认证存储过程
delimiter //
DROP PROCEDURE IF EXISTS authdb.authProc //
create procedure authProc (in appid char(64), in idcard char(18), in curmill bigint, out authflag int)
start_label:
begin
	declare houseid char(32);
	select count(1) into authflag from authdb.TAB_AUTH_INFO where HOUSEID = (select t1.houseid from TAB_DEV_INFO t1 where t1.APPID = appid and t1.RECORDSTATUS = 'Y') and IDCARD = idcard;
	if authflag>0 then
	    select authflag;
		leave start_label;
	end if;
	select t.HOUSEID into @houseid from TAB_VISITORS_INFO t where t.IDCARD = idcard and curmill > cast(t.VALIDATETIME as UNSIGNED) and curmill < (cast(t.VALIDATETIME as UNSIGNED) + t.DURATION * 60 * 1000);
	if @houseid is null then
		set authflag = 0;
		select authflag;
		leave start_label;
	end if;
	select count(1) into authflag from TAB_DEV_INFO t where t.APPID = appid and t.HOUSEID = @houseid and t.RECORDSTATUS = 'Y';
	select authflag;
end;
//
delimiter ;
