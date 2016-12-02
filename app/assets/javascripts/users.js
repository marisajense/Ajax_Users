$(document).ready(function() {
  var $getUsers = $('#get-users');
  var $userForm = $('#add-user-form');
  // Grab data from page
  var $userFirstName = $('#user-first-name');
  var $userLastName = $('#user-last-name');
  var $userPhoneNumber= $('#user-phone_number');
  var $userActive = $('#user-active');
  var $users = $('#users');
  var BASEURL = 'http://devpoint-ajax-example-server.herokuapp.com/api/v1'

  function loadUsers() {
    $users.empty();

    $.ajax({
      type: 'GET',
      url: BASEURL + '/users',
      dataType: 'JSON'
    }).success(function(data) {
      for (var i = 0; i < data.length; i++) {
        var user = data[i];
        $users.append('<div id=' + user.id + '>' + '<div class="col s4">' + user.first_name + " " + user.last_name + '</div>  <button class="blue btn show-user"><i class="material-icons">visibility</i></button> <button class="orange btn edit-user"><i class="material-icons">edit</i></button> <button class="red btn delete-user"><i class="material-icons">delete</i></button> </div>');
      }
    }).fail(function(data) {
      console.log(data);
    });
  }

  //--------------------EDIT BUTTON----------------//
  $(document).on('click', '.edit-user', function() {
  	var userId = $(this).parent().attr('id');
  	$.ajax({
  		type: 'GET',
  		url: BASEURL + '/users/' + userId,
  		dataType: 'JSON'
  	}).success(function(data) {
  		$userFirstName.val(data.first_name).focus();
  		$userLastName.val(data.last_name);
  		$userPhoneNumber.val(data.phone_number);
  		if(!data.active) {
  		  $userActive.removeAttr('checked')
  		} else {
  		  $userActive.attr('checked', data.active);
  		}
  		$userForm.attr('data-user-id', userId);

  	}).fail(function(data) {
  		console.log(data);
  	});
  });

  //-----------------DELETE BUTTON------------------//
  $(document).on('click', '.delete-user', function() {
    var userId = $(this).parent().attr('id');
    $.ajax({
      type: 'DELETE',
      url: BASEURL + '/users/' + userId,
      dataType: 'JSON'
    }).success(function(data) {
      $('#' + userId).remove();
    }).fail(function(data) {
      console.log(data);
    });
  });

  // ----------------SHOW BUTTON------------------//
  $(document).on('click', '.show-user', function() {
    var userId = $(this).parent().attr('id');
    $.ajax({
      type:'GET',
      url: BASEURL + '/users/' + userId,
      dataType: 'JSON',
    }).success(function(data) {
      console.log('show')
      var user = data
      $users.append("<div col s12 class='btn black'>" + user.first_name + " " + user.last_name + " " + user.phone_number + "</div>")
    }).fail(function(data) {
      console.log(data);
    });
  });

$userForm.submit(function(e) {
    e.preventDefault();
    var requestType, requestUrl


    if($(this).data('user-id')) {
      requestType = 'PUT';
      requestUrl = BASEURL + '/users/' + $(this).data('user-id');
    } else {
      requestType = 'POST';
      requestUrl = BASEURL + '/users';
    }
    $.ajax({
      type: requestType,
      url: requestUrl,
      dataType: 'JSON',
      data: {user: {first_name: $userFirstName.val(),
                      last_name: $userLastName.val(),
                      phonenum: $userPhonenum.val(),
                      active: $userActive.val()
                      }}
    }).success(function(data) {
      $userForm[0].reset();
      $userFirstName.focus();
      loadUsers();
    }).fail(function(data) {
      console.log(data);
    });
  });

  $getUsers.click(function() {
    loadUsers();
  });

});
