CREATE TABLE TAB_DEV_INFO (
	APPID CHAR(64) primary KEY comment '设备ID',
	HOUSEID CHAR(64) NOT NULL comment '房屋ID',
	APPINFO VARCHAR(255) NOT NULL default '' comment '设备信息',
	REGISTERTIME CHAR(16) NOT NULL comment '设备注册时间',
	MOBILEPHONE CHAR(16) NOT NULL default '' comment '联系电话',
	RECORDSTATUS CHAR(1) NOT NULL default 'Y' comment '记录状态',
	SPC10 VARCHAR(10) NOT NULL default '' comment '备用字段1',
	SPC20 VARCHAR(20) NOT NULL default '' comment '备用字段2',
	SPC50 VARCHAR(50) NOT NULL default '' comment '备用字段3',
	SPC100 VARCHAR(100) NOT NULL default '' comment '备用字段4'
) comment = '设备信息表';
-- alter table t add primary key (id);


CREATE TABLE TAB_USER_INFO (
	IDCARD CHAR(32) primary KEY comment '用户ID',
	USERNAME VARCHAR(128) NOT NULL comment '用户姓名',
	IMAGEPATH VARCHAR(255) default '' NOT NULL comment '图像地址',
	MOBILEPHONE CHAR(16) NOT NULL comment '联系电话',
	SPC10 VARCHAR(10) NOT NULL default '' comment '备用字段1',
    SPC20 VARCHAR(20) NOT NULL default '' comment '备用字段2',
    SPC50 VARCHAR(50) NOT NULL default '' comment '备用字段3',
    SPC100 VARCHAR(100) NOT NULL default '' comment '备用字段4'
) comment = '用户信息表';

CREATE TABLE TAB_AUTH_INFO (
  	AUTHID INTEGER primary KEY auto_increment comment '授权ID',
  	IDCARD CHAR(32) NOT NULL comment '用户ID',
  	HOUSEID CHAR(64) NOT NULL comment '房屋ID',
  	SPC10 VARCHAR(10) NOT NULL default '' comment '备用字段1',
    SPC20 VARCHAR(20) NOT NULL default '' comment '备用字段2',
    SPC50 VARCHAR(50) NOT NULL default '' comment '备用字段3',
    SPC100 VARCHAR(100) NOT NULL default '' comment '备用字段4'
) comment = '授权信息表';

CREATE TABLE TAB_HOUSE_INFO (
	HOUSEID CHAR(32) primary KEY comment '房屋ID',
	HOUSEINFO VARCHAR(255) NOT NULL comment '房屋信息',
	SCHEMEID INTEGER NOT NULL comment '策略ID',
	HOUSEADDR VARCHAR(255) NOT NULL comment '房屋地址',
	SPC10 VARCHAR(10) NOT NULL default '' comment '备用字段1',
    SPC20 VARCHAR(20) NOT NULL default '' comment '备用字段2',
    SPC50 VARCHAR(50) NOT NULL default '' comment '备用字段3',
    SPC100 VARCHAR(100) NOT NULL default '' comment '备用字段4'
) comment = '房屋信息表';

CREATE TABLE TAB_SCHEMA_INFO (
	SCHEMAID INTEGER not null primary key auto_increment comment '策略ID',
	HOUSEID CHAR(32) NOT NULL comment '房屋ID',
	MODE INTEGER NOT NULL comment '认证模式',
	SCHEMASTARTTIME CHAR(32) NOT NULL comment '策略生效时间',
	SCHEMAENDTIME CHAR(32) NOT NULL comment '策略失效时间',
	SPC10 VARCHAR(10) NOT NULL default '' comment '备用字段1',
    SPC20 VARCHAR(20) NOT NULL default '' comment '备用字段2',
    SPC50 VARCHAR(50) NOT NULL default '' comment '备用字段3',
    SPC100 VARCHAR(100) NOT NULL default '' comment '备用字段4'
) comment = '策略信息表';
