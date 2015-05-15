var app = angular.module('signup', []);

app.controller('SignUpController', function($rootScope, $scope, $http) {
    $scope.submit = function(idno) {
        $http.get('/signup', {"idno": idno})
            .success(function(resp) {	
                console.log(resp);
                $scope.data = resp;
        	})
        	.error(function(resp) {
        		console.log('error');
        		$scope.error = 'error';
        	});
    };
});
