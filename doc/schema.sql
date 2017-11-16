# CREATE DATABASE bee_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `bee_post`; 
CREATE TABLE `bee_post` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `tags` varchar(255) COMMENT '标签列表',
    `desc` varchar(255) COMMENT '描述，用于seo的description',
    `title` varchar(255) NOT NULL COMMENT '标题',
    `summary` varchar(1000) COMMENT '摘要',
    `status` tinyint(4) DEFAULT 0 COMMENT '状态：0草稿；1-发布',
    `create_by` varchar(255) DEFAULT NULL COMMENT '创建人',
    `update_by` varchar(255) DEFAULT NULL COMMENT '更新人',
    `create_at` datetime NOT NULL,
    `update_at` datetime NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `bee_post_content`;
CREATE TABLE `bee_post_content` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `post_id` bigint(20) NOT NULL COMMENT '文章ID',
    `content` mediumtext DEFAULT NULL COMMENT '文章内容',
    `type` tinyint(4) DEFAULT 0 COMMENT '内容格式：0-Markdown；1-Html', 
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章内容' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `bee_post_stat`;
CREATE TABLE `bee_post_stat` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `post_id` bigint(20) NOT NULL COMMENT '文章ID',
    `comment` int DEFAULT 0 COMMENT '文章评论总数',
    `pageview` int DEFAULT 0 COMMENT '文章阅读总数',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章统计' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `bee_tag`;
CREATE TABLE `bee_tag` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL COMMENT '标签名',
    PRIMARY KEY (`id`),
    UNIQUE KEY `udx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `bee_tag_post`;
CREATE TABLE `bee_tag_post` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `tag_id` bigint(20) NOT NULL,
    `post_id` bigint(20) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `udx_tag_id_post_id` (`tag_id`,`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签文章关联' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `bee_user_account`;
CREATE TABLE `bee_user_account` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `username` varchar(64) NOT NULL COMMENT '用户名',
    `password` varchar(255) NOT NULL COMMENT '用户密码',
    `salt` varchar(64) NOT NULL COMMENT '加密盐',
    `nickname` varchar(64) NOT NULL COMMENT '用户昵称',
    `roles` varchar(255) NOT NULL COMMENT '角色列表',
    `create_by` varchar(255) DEFAULT NULL COMMENT '创建人',
    `update_by` varchar(255) DEFAULT NULL COMMENT '更新人',
    `create_at` datetime NOT NULL,
    `update_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `udx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户' AUTO_INCREMENT = 1492696102;
