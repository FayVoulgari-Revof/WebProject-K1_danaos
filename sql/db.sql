DROP TABLE IF EXISTS ADMIN;
DROP TABLE IF EXISTS VAROS;

DROP TABLE IF EXISTS PARAKOLOUTHEI;
DROP TABLE IF EXISTS PLANO_EKGYMNASIS ;

DROP TABLE IF EXISTS AGORAZEI ;
DROP TABLE IF EXISTS SYNDROMI;
DROP TABLE IF EXISTS WORKOUT ;
DROP TABLE IF EXISTS MELOS;
DROP TABLE IF EXISTS session ;


set client_encoding='utf8';

create  TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");




CREATE TABLE AGORAZEI (
	id_agoras bigserial,
	syndromi varchar(50) NOT NULL,
	melos INT,
	hmeromhnia_agoras date NOT NULL,
	hmeromhnia_enarksis date NOT NULL,
	hmeromhnia_lhksis date NOT NULL
); 


CREATE TABLE SYNDROMI (
	code_syndromis varchar(50) NOT NULL,
	onoma_syndromis varchar(50) NOT NULL,
	timi bigint NOT NULL
); 

CREATE TABLE PLANO_EKGYMNASIS (
	id_planou bigserial ,
	onoma varchar(50) NOT NULL
	
	
);
CREATE TABLE VAROS (
	id_varos bigserial,
	melos_id INT not NULL,
	kila float NOT NULL,
	hmeromhnia_kataxwrisis date NOT NULL
	
	
);


CREATE TABLE MELOS (
	id_melous bigserial NOT NULL,
	onoma varchar(50) NOT NULL,
	epwnumo varchar(50) NOT NULL,
	thlefono varchar(10) NOT NULL,
	email varchar(50) NOT NULL,
	kwdikos varchar(256) NOT NULL,
	ipsos float ,
	workout_stoxos bigint,
	varos_stoxos bigint,
	isAdmin boolean default false,
	isConfirmed boolean default false,
	hmeromhnia_eggrafis date NOT NULL

); 



CREATE TABLE PARAKOLOUTHEI (
	melos bigserial ,
	plano bigserial
); 



CREATE TABLE WORKOUT (
	workout_id bigserial NOT NULL,
	hmeromhnia date NOT NULL,
	melos_id INT NOT NULL
); 



ALTER TABLE PLANO_EKGYMNASIS ADD CONSTRAINT PLANO_EKGYMNASIS_pk PRIMARY KEY (id_planou);
ALTER TABLE MELOS ADD CONSTRAINT MELOS_pk PRIMARY KEY (id_melous);
ALTER TABLE WORKOUT ADD CONSTRAINT WORKOUT_pk PRIMARY KEY (workout_id);
ALTER TABLE SYNDROMI ADD CONSTRAINT syndromi_pk PRIMARY KEY (code_syndromis);
ALTER TABLE PARAKOLOUTHEI ADD CONSTRAINT PARAKOLOUTHEI_pk PRIMARY KEY (melos,plano);
ALTER TABLE VAROS ADD CONSTRAINT VAROS_pk PRIMARY KEY (id_varos);
ALTER TABLE AGORAZEI ADD CONSTRAINT AGORAZEI_pk PRIMARY KEY (id_agoras) ;

ALTER TABLE PARAKOLOUTHEI ADD CONSTRAINT PARAKOLOUTHEIfk0 FOREIGN KEY (melos) REFERENCES MELOS(id_melous);
ALTER TABLE PARAKOLOUTHEI ADD CONSTRAINT PARAKOLOUTHEIfk1 FOREIGN KEY (plano) REFERENCES PLANO_EKGYMNASIS(id_planou);
ALTER TABLE WORKOUT ADD CONSTRAINT WORKOUT_fk0 FOREIGN KEY (melos_id) REFERENCES MELOS(id_melous);
ALTER TABLE VAROS ADD CONSTRAINT VAROS_fk0 FOREIGN KEY (melos_id) REFERENCES MELOS(id_melous);
ALTER TABLE AGORAZEI ADD CONSTRAINT AGORAZEI_fk0 FOREIGN KEY (melos) REFERENCES MELOS(id_melous);
ALTER TABLE AGORAZEI ADD CONSTRAINT AGORAZEI_fk1 FOREIGN KEY (syndromi) REFERENCES SYNDROMI(code_syndromis);


INSERT INTO PLANO_EKGYMNASIS(id_planou,onoma ) VALUES (1,'trx');
INSERT INTO PLANO_EKGYMNASIS(id_planou,onoma ) VALUES (2,'cross');
INSERT INTO PLANO_EKGYMNASIS(id_planou,onoma ) VALUES (3,'bodypump');
INSERT INTO PLANO_EKGYMNASIS(id_planou,onoma ) VALUES (4,'zumba');
INSERT INTO PLANO_EKGYMNASIS(id_planou,onoma ) VALUES (5,'pilates');
INSERT INTO PLANO_EKGYMNASIS(id_planou,onoma ) VALUES (6,'hipsabs');
INSERT INTO PLANO_EKGYMNASIS(id_planou,onoma ) VALUES (7,'kickPro');
INSERT INTO PLANO_EKGYMNASIS(id_planou,onoma ) VALUES (8,'kickKids');



INSERT INTO SYNDROMI(code_syndromis,onoma_syndromis,timi ) VALUES ('MonthlyOrgana','Μηνιαία',30);
INSERT INTO SYNDROMI(code_syndromis,onoma_syndromis,timi ) VALUES ('YearlyOrgana','Ετήσια',179);
INSERT INTO SYNDROMI(code_syndromis,onoma_syndromis,timi ) VALUES ('kickPro','Kick Box',40);
INSERT INTO SYNDROMI(code_syndromis,onoma_syndromis,timi ) VALUES ('kickKids','Παιδικό Kick Box',35);



INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Σπύρος','Κουρούκλης','6974350680','s.kourouklis@hotmail.com','$2b$12$DdRe7ebMQQyz6qe3y1t59OfDXnR3ahzHfrOwdU81LK36dgvIp5sIK', NULL,NULL,NULL,'TRUE','TRUE','2021-04-30');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Φωτεινή','Βούλγαρη','6948123568','foto798@gmail.com','$2b$12$3cl.NNfn/4jYNBLQCXf2v.7FG3gU7FtfZN92mHWCMyP1/6Z40L2Ve', 162,4,57,'FALSE','TRUE','2021-04-20');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Γιώργος','Λιακόπουλος','6948334710','liakopgeo@gmail.com','$2b$12$7XSZOEZEVlpFHWf4TnA55udV3TXMQcg3//0UzqF9KiaAZMD11RAsK', 175,5,70,'FALSE','TRUE','2021-04-20');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Γιώργος','Αντωνίου','6979093268','geodimyolo@gmail.com','$2b$12$wA/9.zzrRQdVX2Fl2Q35n.ZtiYEWD5x/DUQtmYsYL1hYHvb.MOiSS', 184,3,80,'FALSE','TRUE','2021-05-02');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Ανθή','Παπασάββα','6946313922','anthibee@gmail.com','$2b$10$4XtpCg0Akh01ctSYkkQCBu6pI6tFewA9iSmNWmwR6uopsub0CnYyC', 164,4,56,'FALSE','TRUE','2021-05-17');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Δώρα','Κοτσανά','6979459763','kotsanadora@gmail.com','$2b$12$X18ZmcJVKoOX2h2kvfxrk.L/OItvE0mkPEi/2haNs3A8KSxUgRGKu', 171,2,65,'FALSE','TRUE','2021-05-01');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Αλέξανδρος','Βασιλείου','6976643423','a_vasileiou@yahoo.com','$2b$12$6T6P6T.OZBUSl9cC0by0ku7nWQ..Zpw6UgL52/YD8pf1PWbc.r6f2', 180,3,NULL,'FALSE','TRUE','2021-06-01');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Δημήτρης','Γεωργακόπουλος','6944451387','dimgeo@hotmail.com','$2b$12$27bHnwTOe5enSr301zTGrewJORiePtNqB.73q8OCMzdjMgrYI3xke', 175,4,NULL,'FALSE','TRUE','2021-04-20');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Μαρίνα','Σάμαρη','6943403125','maasamari@gmail.com','$2b$12$UG2UhGepAJ/CD1Yf0fEH1OMD0qBVKfpWBZY8w.aq5PzTaNaNNjqpK', 175,2,65,'FALSE','TRUE','2021-05-12');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Δανάη','Κούτρα','6909159827','koutriniod@hotmail.com','$2b$12$NdJNdOV4qmV1sWmud3aZmu3Gl6Bvbwh2FIPnQKsSYMzCSgDxADmAm', 167,3,62,'FALSE','TRUE','2021-05-12');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Κωνσταντίνος','Παππάς','6974282894','konnasapap@gmail.com','$2b$12$PalC1RdcW.zFySJg3/Hase01JjO1dn5/cfZD3H.wtniYinsQ1tB8i', NULL,NULL,NULL,'FALSE','TRUE','2021-06-01');

INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Μάριος','Πράπας','6978941219','mario77@hotmail.com','$2b$12$97/WZ3w4nA14nM9hKAU9Qeya8wBwiJAbj6vfMtKovFG2coBjKAqGy', NULL,NULL,NULL,'FALSE','TRUE','2021-06-03');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Χρύσα','Αλεξάνδρου','6944975987','imxrusa@hotmail.com','$2b$12$NlSj2kh8iJZXI8rqLc/SsOigRSbkNEhPOzVfAB9Gu8rFdG0M0mnCq', NULL,NULL,NULL,'FALSE','TRUE','2021-06-02');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Δημήτρης','Τσάκος','6973012344','tsakomimis@gmail.com','$2b$12$0TON4IBUlxN/hH3.0owUMuhAgUrVHQ99EQxMlG.reROd/t26P01Mi', 175,NULL,NULL,'FALSE','TRUE','2021-06-03');

INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Κατερίνα','Ματίνοπούλου','6943150021','kat98@hotmail.com','$2b$12$mIBrQ2tlLUAmjjV4j8.ekOap5xPyhSpl/P4Jqbci4dsbosIk77P12', NULL,NULL,NULL,'FALSE','TRUE','2021-06-01');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Νίκος','Γεωργίου','6978227314','geonikolas@hotmail.com','$2b$12$J8o38nkfBQFzlYaWvJh8y.eZk66Z2s2lbZeD21zrpd79ukEMQPFLW', NULL,NULL,NULL,'FALSE','TRUE','2021-06-02');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Ελένη','Νικολάου','6978124198','elenik@gmail.com','$2b$12$mWvU74dP5rG63vwuZQFJKePmSTGXxvytogc2t3ygUVjXwKvfCIu/e', 175,NULL,NULL,'FALSE','TRUE','2021-06-01');
INSERT INTO MELOS(onoma,epwnumo ,thlefono ,email ,kwdikos ,ipsos ,workout_stoxos ,varos_stoxos ,isAdmin ,isConfirmed,hmeromhnia_eggrafis) VALUES ('Ζωή','Δημητρίου','6934415744','zoedem@hotmail.com','$2b$12$UK08cMaMYzyawoM3MFayIONpqLu23Iqw01GNV3mN7jCPQRuKpq1PG', NULL,NULL,NULL,'FALSE','TRUE','2021-06-03');

INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (2,64.5,'2021-05-01');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (2,63.7,'2021-05-06');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (2,63,'2021-05-13');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (2,61.9,'2021-05-21');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (2,61,'2021-06-01');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (3,63,'2021-05-04');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (3,63.7,'2021-05-16');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (3,64.5,'2021-05-29');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (4,91.5,'2021-05-03');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (4,90.3,'2021-05-10');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (4,89,'2021-05-17');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (4,87.2,'2021-05-29');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (5,60.5,'2021-05-18');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (5,59.7,'2021-05-21');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (5,59,'2021-05-30');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (6,74,'2021-05-09');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (6,72,'2021-05-27');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (7,78,'2021-05-17');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (9,69,'2021-05-12');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (9,68.5,'2021-05-19');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (9,67,'2021-05-30');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (10,65,'2021-05-13');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (10,64.5,'2021-05-19');
INSERT INTO VAROS(melos_id ,kila ,hmeromhnia_kataxwrisis) VALUES (10,63.5,'2021-05-28');


INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-01',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-04',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-06',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-10',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-14',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-16',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-20',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-25',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-26',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-29',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-30',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-06-02',2);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-05',3);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-10',3);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-12',3);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-15',3);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-20',3);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-26',3);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-30',3);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-10',4);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-13',4);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-16',4);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-17',4);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-20',4);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-26',4);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-30',4);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-06-02',4);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-05-27',6);
INSERT INTO WORKOUT(hmeromhnia ,melos_id) VALUES ('2021-06-02',6);



INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (2,1);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (2,2);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (2,4);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (3,1);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (3,7);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (4,1);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (4,3);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (4,7);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (5,4);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (6,5);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (6,8);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (7,7);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (8,7);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (9,3);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (9,4);
INSERT INTO PARAKOLOUTHEI (melos ,plano) VALUES (10,5);


INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('MonthlyOrgana',2,'2021-05-01','2021-05-01','2021-06-01');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('MonthlyOrgana',2,'2021-05-31','2021-06-01','2021-07-01');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('YearlyOrgana' ,3,'2021-05-01','2021-05-01','2022-05-01');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('kickPro' ,3,'2021-05-01','2021-05-03','2021-06-03');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('kickPro' ,3,'2021-06-02','2021-06-02','2021-07-02');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('kickPro' ,4,'2021-05-15','2021-05-16','2021-06-16');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('kickPro' ,4,'2021-05-20','2021-05-20','2021-06-20');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('YearlyOrgana' ,5,'2021-05-20','2021-05-20','2022-05-20');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('kickKids' ,6,'2021-05-02','2021-05-02','2021-06-02');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('kickKids' ,6,'2021-06-02','2021-06-02','2021-07-02');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('YearlyOrgana' ,6,'2021-05-10','2021-05-12','2022-05-12');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('kickPro' ,7,'2021-05-11','2021-05-11','2021-06-11');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('kickPro' ,8,'2021-05-09','2021-05-11','2021-06-11');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('MonthlyOrgana',9,'2021-05-05','2021-05-05','2021-06-05');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('MonthlyOrgana',10,'2021-05-11','2021-05-11','2021-06-11');

INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('MonthlyOrgana' ,11,'2021-06-03','2021-06-03','2021-07-03');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('MonthlyOrgana',12,'2021-06-02','2021-06-05','2021-07-05');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('MonthlyOrgana',13,'2021-06-02','2021-06-02','2021-07-02');
INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ('MonthlyOrgana',17,'2021-06-02','2021-06-02','2021-07-02');



