
var app = angular.module('myApp', ["ui.router"]);
  window.baseUrl="https://10.21.96.211:8000/keepsapp/";
app.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('Login', {
			url: '/login',
			templateUrl: './login.html',
			controller: "LoginCtrl",
	
		})
		.state('Register', {
			url: '/register',			templateUrl: "./register.html",
			controller: "RegisterCtrl"
		})
		.state('Dashboard', {
			url: '/dashboard',
			templateUrl: "./dashboard.html",
			controller: "DasCtrl",

		})
		.state('Trash',{
			url:'/trash',
			templateUrl:"./trash.html",
			controller:"TrashCtrl",
		
		})
	$urlRouterProvider.otherwise("/");

});

// app.controller("MainCtrl",function($scope,$http,$location,user){
    
// 	$scope.status=true;

// });

//login

app.controller("LoginCtrl", function ($scope, $http, $state) {
	$scope.$parent.status = false;
	$scope.login = function () {
		var students = {
			username: $scope.username,
			password: $scope.password,
		};
		$scope.isLoading = true;
		$http({
			method: "POST",
			url:window.baseUrl+"login",
			withCredentials: true,
			data: students,
		}).then(
			function (response) {
				$scope.isLoading = false;
				$scope.$parent.status = true;
				$state.go('Dashboard');
				

			},
			function (response) {
				console.log(response.status);
				$scope.isLoading = false;
				if (response.status == 303) {
					alert("Username Not Exist");
					$state.go('Register');
				
				}
				if(response.status==401){
					alert("Not Valid Credential");
				
				}
			}
		);
	};
});

//register 

app.controller('RegisterCtrl', function ($scope, $http, $state) {
	$scope.signup = function () {
		$scope.$parent.status=false;
		var students = {
			first_name: $scope.fname,
			last_name: $scope.lname,
			username: $scope.uname,
			email: $scope.mail,
			password: $scope.pass,
			confirm_password: $scope.cnfpass
		}
		$scope.isLoading = true;
		$http({
			method: "POST",
			url: window.baseUrl+"register",
			data: students,
			withCredentials:true
		})
			.then(function (response) {
				console.log(response.data)
				$scope.isLoading = false;
				$state.go('Login');
				
			},
				function (response) {
					console.log(response.status)
					$scope.isLoading = false;

					if (response.status == 403) {
						{	
							alert("Username Already Exist");
							$state.go('Login');
						}
					}
					if (response.status == 304) {
						alert("Password And Confirm Password Not Same!");
					}
				});
	};
});

//Trash

app.controller('TrashCtrl', function ($scope, $http) {

	$scope.data = [];
	$scope.bin = function (x) {
		$http({
			method: "GET",

		    url:window.baseUrl+"trash",
		params:{"id":x},
		withCredentials:true
		})
			.then(function (response) {
				$scope.data=response.data;
				console.log(response.data);

			},
				function (response) {
					console.log(response.data);
				})
	}
	$scope.bin();
	$scope.restore=function(x){
	
		$http({
			method:"GET",
		  url:window.baseUrl+"restore",
			
			params:{"id":x},
			withCredentials:true
		
		})
		.then(function(response){
			console.log("Restored");
			$scope.bin();
		},
		function(response){
			console.log("Not Restored");
		})
	}
	
	$scope.delete=function(x){
	
		$http({
			method:"GET",
		url:window.baseUrl+"perm_delete",
	
			params:{"id":x},
			withCredentials:true
		
		})
		.then(function(response){
			console.log("Deleted Permanently");
			$scope.bin();
			
		},
		function(response){
			console.log("Not Deleted");
		})
	}
    
});

//dashboard

app.controller('DasCtrl', function ($scope, $http,$state) {

	$scope.data = [];
	$scope.add = function () {
		var notes={

			title:$scope.title,
			description:$scope.note

		}
		$scope.isLoading=true;
		$http({
			method: "POST",

		url:window.baseUrl+"createnote",
			data:notes,
			withCredentials:true
		})
			.then(function (response) {
				console.log(response.data);
				$scope.view();
				$scope.isLoading=false;
			},
				function (response) {
					console.log(response.data);
				})
	}
	
	$scope.values = [];
	$scope.view = function () {

		$http({
			method: "GET",
		
		      url:window.baseUrl+"viewnotes",
			  withCredentials:true
		})
			.then(function (response) {
				$scope.values=response.data;
			}, 
				function (response) {
					console.log(response.data);
				})
				
	}
	$scope.view();
	$scope.move=function(x){
		console.log(x);
		$http({
			method:"GET",
		     url:window.baseUrl+"delnote",
			
			params:{"id":x},
			withCredentials:true
		
		})
		.then(function(response){
			console.log("Moved To Bin");
			$scope.view();
		},
		function(response){
			console.log("Not Moved");
		})
	}

    $scope.logout=function(){
		
		$scope.isLoading = true;
		$http({
			method:"GET",
			
			url:window.baseUrl+"logout",
			withCredentials:true
		})
		.then(function(response){
			console.log("Log Out");
			$scope.isLoading = false;
			$state.go("Login");
		}),
		function(response){
			console.log("Log Out Failed");
		
		}
	}

});


