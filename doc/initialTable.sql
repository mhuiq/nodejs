CREATE TABLE TAB_DEV_INFO (
	APPID TEXT PRIVATE KEY (APPID),
	USRID INTEGER NOT NULL,
	APPINFO TEXT NOT NULL,
	REGISTERTIME TEXT NOT NULL,
	MOBILEPHONE TEXT NOT NULL,
	AUTHMODE TEXT NOT NULL,
	RECORDSTATUS TEXT NOT NULL,
	SPC10 TEXT NOT NULL,
	SPC20 TEXT NOT NULL,
	SPC50 TEXT NOT NULL,
	SPC100 TEXT NOT NULL
};

CREATE TABLE TAB_DEV_INFO (
	USERID INTEGER PRIVATE KEY (USERID)，
	USERNAME TEXT NOT NULL,
	IDCARD TEXT NOT NULL,
	IMAGE TEXT NOT NULL,
	MOBILEPHONE TEXT NOT NULL,
	SPC10 TEXT NOT NULL,
	SPC20 TEXT NOT NULL,
	SPC50 TEXT NOT NULL,
	SPC100 TEXT NOT NULL
};
