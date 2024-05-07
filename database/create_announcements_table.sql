CREATE TABLE `announcements` (
  `announcements_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `description` varchar(350) NOT NULL,
  `source` varchar(500) DEFAULT NULL,
  `idgroups` int(11) NOT NULL,
  PRIMARY KEY (`announcements_id`),
  UNIQUE KEY `announcements_id_UNIQUE` (`announcements_id`),
  KEY `idgroups_idx` (`idgroups`),
  CONSTRAINT `idgroups` FOREIGN KEY (`idgroups`) REFERENCES `groups` (`idgroups`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
