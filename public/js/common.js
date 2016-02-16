var app = angular.module("AdneomNews", []);

app.controller("MainController", ["$scope", "$http", function($scope, $http) {
  // page initialization
  $(".tab-menu li a").click(function(event) {
    event.preventDefault();
    $(this).parent().addClass("current");
    $(this).parent().siblings().removeClass("current");
    var tab = $(this).attr("href");
    $(".tab-content").not(tab).css("display", "none");
    $(tab).fadeIn();
  });
  
  $scope.hasTitle = function (post) {
    return (post.title); 
  };
  
  // $http functions
  $http.get("http://adneom.herokuapp.com/api/posts/")
    .success(function (response) {
      $scope.posts = response;
      $scope.postsWithComment = []
  });
  $scope.toggleComments = function (postId) {
    if (typeof $scope.postsWithComment[postId] === "undefined") {
      $scope.getComments(postId);
    } else {
      $scope.postsWithComment[postId]["show"] = !$scope.postsWithComment[postId]["show"];
    }
  };
  $scope.getComments = function (postId) {
    $http.get("http://adneom.herokuapp.com/api/posts/" + postId)
      .success(function (response) {
        $scope.postsWithComment[postId] = response;
        $scope.postsWithComment[postId]["show"] = true;
    });
  };
  $scope.upvotePost = function (postId) {
    $http.put("http://adneom.herokuapp.com/api/posts/" + postId + "/upvote")
      .success(function (response) {
        $scope.refreshPost(response);
    });
  };
  
  $scope.refreshPost = function (post) {
    for (index = 0; index < $scope.posts.length; ++index) {
      if ($scope.posts[index]._id == post._id) {
        $scope.posts[index] = post;
        break;
      }
    }
  }
}]);

app.directive("postForm", ['$http', function($http) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    template: 
    '<div>' +
    '  <form class="post-form" ng-submit="submitPost()">' + 
    '    <input class="title-input" name="titleInput" type="text" ng-model="title" placeholder="Title"/>' + 
    '    <input class="link-input" name="linkInput" type="text" ng-model="link" placeholder="Link"/>' + 
    '    <input class="post-submit" type="submit" value="add post"></input>' + 
    '  </form>' + 
    '</div>',
    link: function(scope, element, attrs){
      scope.title = "";
      scope.link = "";
      scope.submitPost = function () {
        $http.post("http://adneom.herokuapp.com/api/posts", {title: scope.title, link: scope.link})
          .success(function(response, status) {
            //TODO come back to main view
        })
      };
    }
  };
}]);

app.directive("commentForm", ['$http', function($http) {
  return {
    restrict: 'E',
    replace: true,
    scope: {post: '='},
    template: 
    '<div>' +
    '  <form class="commentForm" ng-submit="submitComment()">' + 
    '    <input class="author-input" name="authorInput" type="text" ng-model="author" placeholder="Author"/>' + 
    '    <textarea class="body-input" name="bodyInput" ng-model="body" placeholder="Type your comment here" cols="60" rows="3"></textarea>' + 
    '    <input class="comment-submit" type="submit" value="send comment"></input>' + 
    '  <div class="clearBoth"></div></form>' + 
    '</div>',
    link: function(scope, element, attrs){
      scope.submitComment = function () {
        $http.post("http://adneom.herokuapp.com/api/posts/" + scope.post._id + "/comments", {author: scope.author, body: scope.body})
          .success(function(response, status) {
            //TODO update post
          });
      };
    }
  };
}]);

app.filter( 'domain', function () {
  return function ( input ) {
    var matches,
      output = "",
      urls = /\w+:\/\/([\w\.-]+)/;
    matches = urls.exec( input );
    if ( matches !== null ) {
      output = matches[1];
    } else if (input) {
      output = input;
    }
    return output;
  };
});