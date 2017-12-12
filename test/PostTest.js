// const co = require('co')
// const services = require('../services')

// function *testCreatePost () {
//     let post =  {
//         title: 'test',
//         content: 'this is a test',
//         createBy: 'linh'
//     }
//     try {
//         let result = yield services.PostService.createPost(post)
//         console.log(result)
//     } catch (e) {
//         console.log(e)
//     }
// }

// function *testGetAritcleById () {
//     let postId = 1492696128

//     try {
//         let result = yield services.PostService.getPostById(postId)
//         console.log(result)
//     } catch (e) {
//         console.log(e)
//     }
// }

// function *testGetPosts () {
//     try {
//         let result = yield services.PostService.getPosts({limit: 10, offset: 0})
//         console.log(result.count)
//         console.log(result.rows)
//     } catch (e) {
//         console.log(e)
//     }
// }

// co(testGetPosts)
