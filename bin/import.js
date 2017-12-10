#!/usr/bin/env node
const co = require('co')
const fs = require('fs')
const path = require('path')
const yaml = require('yaml-front-matter')

const models = require('../models')
const services = require('../services')
const PostService = services.PostService

let args = process.argv.splice(2)
args.forEach((item) => {
    let target = path.join(__dirname, item)
    fs.readFile(target, { encoding: 'utf-8', flag: 'r' }, (error, result) => {
        if (error) {
            console.error(error)
            return
        }
        let json = yaml.loadFront(result)
        co(function* () {
            let created = yield PostService
                .createPost({
                    tags: json.tags,
                    desc: json.desc,
                    title: json.title,
                    content: json.__content,
                    permalink: json.permalink,
                    createAt: json.date,
                    createBy: json.author
                })
            return created
        }).then((resp) => {
            console.log('导入成功：', resp)
            models.client.close()
        }).catch((err) => {
            console.error('导入失败：', err)
            models.client.close()
        })
    })
})
