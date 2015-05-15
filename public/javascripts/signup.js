var app = angular.module('signup', []);

app.controller('SignUpController', function($rootScope, $scope, $http) {
    $scope.submit = function(idno) {
        $http.get('/checkmember/' + idno)
            .success(function(resp) {	
                console.log(resp);
                $scope.data = resp;

				$http.get('/cardreader')
					.success(function(resp) {
						console.log(resp);
						var token = resp.token;

						$http.post('http://123.23.23.23/opencard', { email: $scope.email, token: token, cardno: idno })
							.success(function(resp) {
								// Show message
							});
						
					});
        	})
        	.error(function(resp) {
        		console.log('error');
        		$scope.error = 'error';
        	});
    };
});
