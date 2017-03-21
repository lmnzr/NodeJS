CREATE TABLE IF NOT EXISTS users (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  username varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  pass varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  email varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  name varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  status  varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (username)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

INSERT INTO users (username, pass, email, name, adminstatus)
VALUES ('lmnzr','azuresky102','almas@mail.com','Almas',false);
INSERT INTO users (username, pass, email, name, adminstatus)
VALUES ('azuresky','azuresky102','almas@mail.com','Almas',1);

SELECT COUNT(*) FROM admin;
DROP TABLE users;
TRUNCATE TABLE users;

CREATE TABLE CompressType
(
CT_Id int(10) unsigned NOT NULL AUTO_INCREMENT,
CT_Name varchar(10) COLLATE utf8_unicode_ci NOT NULL,
PRIMARY KEY (CT_Id)
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
INSERT INTO CompressType (CT_Name) VALUES ('.zip');
INSERT INTO CompressType (CT_Name) VALUES ('.rar');
INSERT INTO CompressType (CT_Name) VALUES ('.tar');
INSERT INTO CompressType (CT_Name) VALUES ('unassigned');

CREATE TABLE Jobs
(
Job_Id int(10) unsigned NOT NULL AUTO_INCREMENT,
User_Id int(10) unsigned NOT NULL,
Job_Name varchar(100) COLLATE utf8_unicode_ci NOT NULL,
Job_Compress int(10) unsigned NOT NULL,
Job_Date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
Job_Status varchar(50) COLLATE utf8_unicode_ci NOT NULL,
Job_FileName varchar(100) COLLATE utf8_unicode_ci,
Job_FilePath varchar(300) COLLATE utf8_unicode_ci,
PRIMARY KEY (Job_Id),
FOREIGN KEY (User_Id) REFERENCES users(id),
FOREIGN KEY (Job_Compress) REFERENCES CompressType(CT_Id)
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

DELIMITER //

CREATE TRIGGER JobDate_after_update
BEFORE UPDATE
   ON Jobs FOR EACH ROW

BEGIN

   -- Set date update into jobs table
   SET  New.Job_Date = NOW();

END; //

DELIMITER ;
DROP TRIGGER IF EXISTS JobDate_after_update;


INSERT INTO Jobs (User_Id, Job_Name,Job_Compress,Job_Status) VALUES (1,'Test Job',1,'Created');

UPDATE Jobs SET Job_Status='Uploaded' WHERE User_ID=1;
UPDATE Jobs SET Job_Status='Done' WHERE User_ID=1;
DELETE FROM Jobs WHERE Job_Id = 1 ;
DROP TABLE Jobs;
TRUNCATE TABLE Jobs;


