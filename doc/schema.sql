# CREATE DATABASE fx_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `fx_article`; 
CREATE TABLE `fx_article` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `tags` varchar(255) COMMENT '文章标签列表',
    `title` varchar(255) NOT NULL COMMENT '文章标题',
    `summary` varchar(1000) COMMENT '文章摘要',
    `status` tinyint(4) DEFAULT 0 COMMENT '文章状态：0草稿；1-发布',
    `create_by` varchar(255) DEFAULT NULL COMMENT '创建人',
    `update_by` varchar(255) DEFAULT NULL COMMENT '更新人',
    `create_at` datetime NOT NULL,
    `update_at` datetime NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `fx_article_content`;
CREATE TABLE `fx_article_content` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `article_id` bigint(20) NOT NULL COMMENT '文章ID',
    `content` mediumtext DEFAULT NULL COMMENT '文章内容',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章内容' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `fx_article_stat`;
CREATE TABLE `fx_article_stat` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `article_id` bigint(20) NOT NULL COMMENT '文章ID',
    `comment` int DEFAULT 0 COMMENT '文章评论总数',
    `pageview` int DEFAULT 0 COMMENT '文章阅读总数',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章统计' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `fx_tag`;
CREATE TABLE `fx_tag` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL COMMENT '标签名',
    PRIMARY KEY (`id`),
    UNIQUE KEY `udx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `fx_tag_article`;
CREATE TABLE `fx_tag_article` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `tag_id` bigint(20) NOT NULL,
    `article_id` bigint(20) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `udx_tag_id_article_id` (`tag_id`,`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签文章关联' AUTO_INCREMENT = 1492696102;

DROP TABLE IF EXISTS `fx_user_account`;
CREATE TABLE `fx_user_account` (
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
