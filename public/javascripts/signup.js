var app = angular.module('signup', []);

app.controller('SignUpController', function($rootScope, $scope, $http) {
    $scope.submit = function(idno) {
        $http.jsonp('http://localhost:3000/signup?q={ "token": ' + idno + ' }&callback=JSON_CALLBACK', {})
            .success(function(resp) {
                console.log(resp)
        });
    };
});
