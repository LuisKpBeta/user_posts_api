# Posts API

An API for a simple Social Media, where users can public posts and see what others user are posting too

## Technologies
* NodeJs
* Express
* JWT token
* Postgres

## End-Points

* Authentication
```
{
   functionality:Login,
   {
        verb:POST,
        route:/auth/login
        body:{ email, password}
        response:{ token, userId}
   }
   functionality:SignUp,
   {
        verb:PUT,
        route:/auth/signup
        body:{ email, name, password}
        response:{message}
   }
}
```
* User feed
```
{
   functionality:List posts,
   {
        verb:GET,
        route:/feed/posts
        query:{page}
        header:{Bearer authorization}
        response:{posts}
   }
   functionality:Get a post,
   {
        verb:GET,
        route:/feed/post/:postId
        params:{postId}
        header:{Bearer authorization}
        response:{post}
   }
   functionality:Create a post,
   {
        verb:POST,
        route:/feed/posts
        body:{title,content}
        header:{Bearer authorization}
        response:{message,post}
   }
   functionality:Update a post,
   {
        verb:PUT,
        route:/feed/post/:postId
        params:{postId}
        body:{title,content,creator_id}
        header:{Bearer authorization}
        response:{message}
   }
   functionality:Delete a post,
   {
        verb:DELETE,
        route:/feed/post/:postId
        params:{postId}
        body:{creator_id}
        header:{Bearer authorization}
        response:{message}
   }
}
```

### Database configuration
* Change database credentials at ./config/config.json
* Run migrations for create tables
### Tests
Application was tested using Jest library 
[Image of Tests coverage](https://github.com/LuisCarlosb3/user_posts_api/blob/master/coverage.png)
### Usage
```
npm install
npm run start OR node index.js
```


