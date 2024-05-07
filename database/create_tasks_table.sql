CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `task_name` varchar(35) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `idgroups` int(11) NOT NULL,
  PRIMARY KEY (`task_id`),
  KEY `idgroup_idx` (`idgroups`),
  CONSTRAINT `idgroup` FOREIGN KEY (`idgroups`) REFERENCES `groups` (`idgroups`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
