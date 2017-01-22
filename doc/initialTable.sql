-- CREATE DATABASE IF NOT EXISTS authDB default character set utf8 COLLATE utf8_general_ci;
-- 导入命令 mysql> source ${path_to_sql}
-- 一、导出数据库用mysqldump命令（注意mysql的安装路径，即此命令的路径）：
--   1、导出数据和表结构：
--   mysqldump -u用户名 -p密码 数据库名 > 数据库名.sql
--   #/usr/local/mysql/bin/   mysqldump -uroot -p abc > abc.sql
--   敲回车后会提示输入密码
--
--   2、只导出表结构
--   mysqldump -u用户名 -p密码 -d 数据库名 > 数据库名.sql
--   #/usr/local/mysql/bin/   mysqldump -uroot -p -d abc > abc.sql
--
--   注：/usr/local/mysql/bin/  --->  mysql的data目录
--
--
--   二、导入数据库
--   1、首先建空数据库
--   mysql>create database abc;
--
--   2、导入数据库
--   方法一：
--   （1）选择数据库
--   mysql>use abc;
--   （2）设置数据库编码
--   mysql>set names utf8;
--   （3）导入数据（注意sql文件的路径）
--   mysql>source /home/abc/abc.sql;
--   方法二：
--   mysql -u用户名 -p密码 数据库名 < 数据库名.sql
-- --  #mysql -uabc_f -p abc < abc.sql

CREATE TABLE TAB_DEV_INFO (
	APPID TEXT PRIVATE KEY (APPID),
	HOUSEID TEXT NOT NULL,
	APPINFO TEXT NOT NULL,
	REGISTERTIME TEXT NOT NULL,
	MOBILEPHONE TEXT NOT NULL,
	RECORDSTATUS TEXT NOT NULL,
	SPC10 TEXT NOT NULL,
	SPC20 TEXT NOT NULL,
	SPC50 TEXT NOT NULL,
	SPC100 TEXT NOT NULL
};

CREATE TABLE TAB_DEV_INFO (
	IDCARD TEXT PRIVATE KEY (IDCARD)，
	USERNAME TEXT NOT NULL,
	IMAGEPATH TEXT NOT NULL,
	MOBILEPHONE TEXT NOT NULL,
	SPC10 TEXT NOT NULL,
	SPC20 TEXT NOT NULL,
	SPC50 TEXT NOT NULL,
	SPC100 TEXT NOT NULL
};

CREATE TABLE TAB_AUTH_INFO (
  	AUTHID TEXT PRIVATE KEY (AUTHID)，
  	IDCARD TEXT NOT NULL,
  	HOUSEID TEXT NOT NULL,
  	SPC10 TEXT NOT NULL,
  	SPC20 TEXT NOT NULL,
  	SPC50 TEXT NOT NULL,
  	SPC100 TEXT NOT NULL
};

CREATE TABLE TAB_HOUSE_INFO (
	HOUSEID TEXT PRIVATE KEY (HOUSEID)，
	HOUSEINFO TEXT NOT NULL,
	SCHEMEID TEXT NOT NULL,
	HOUSEADDR TEXT NOT NULL,
	SPC10 TEXT NOT NULL,
	SPC20 TEXT NOT NULL,
	SPC50 TEXT NOT NULL,
	SPC100 TEXT NOT NULL
};

CREATE TABLE TAB_SCHEMA_INFO (
	SCHEMAID TEXT PRIVATE KEY (SCHEMAID)，
	HOUSEID TEXT NOT NULL,
	MODE TEXT NOT NULL,
	SCHEMASTARTTIME TEXT NOT NULL,
	SCHEMAENDTIME TEXT NOT NULL,
	SPC10 TEXT NOT NULL,
	SPC20 TEXT NOT NULL,
	SPC50 TEXT NOT NULL,
	SPC100 TEXT NOT NULL
};
