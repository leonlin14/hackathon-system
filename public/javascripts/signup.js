var app = angular.module('signup', []);

app.controller('SignUpController', function($rootScope, $scope, $http) {
    $scope.submit = function(idno) {
        $http.get('/checkmember/' + idno)
            .success(function(resp) {	
				var member = resp;
                $scope.data = 'success';

				$http.get('/cardreader')
					.success(function(resp) {
						console.log(resp);
						var token = resp.token;

						$http.post('/opencard', { 'email': member.email, 'token': token, 'cardno': idno })
							.success(function(resp) {
								// Show message
								$scope.data = 'savedCard';
							});
						
					});
        	})
        	.error(function(resp) {
        		console.log('error');
        		$scope.error = 'error';
        	});
    };
});
