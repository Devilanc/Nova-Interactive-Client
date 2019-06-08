//This Code will 
$.ajaxSetup({cache:false});

const PlaySound = new Audio('Plugins/client-uikit/sounds/sfx-client-play.ogg');
const child = require('child_process').execFile;
const clientPath = "C:\\Nova Interactive\\Client\\GameClient.exe";

const loginsound = new Audio('Plugins/client-login/sounds/login-click.ogg');
let bgm = new Audio('Plugins/client-login/assets/sfx-login.mp3');

const TickSound = new Audio('Plugins/client-uikit/sounds/sfx-client-nav-tick.ogg');

const ns = new Audio('Plugins/client-uikit/sounds/notification_open.ogg');
const nsc = new Audio('Plugins/client-uikit/sounds/notification_close.ogg');

const lobbyHeaderURL = "https://dl.dropboxusercontent.com/s/kc3rk3zs41dcuus/novaclient-config.json";
const serviceStatusURL = "https://dl.dropboxusercontent.com/s/vcl5eaxw3sugdt5/notification.json";

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAAUf7OIOgzkNY8c0DWg859XLijWfucL0A",
    authDomain: "novaauth.firebaseapp.com",
    databaseURL: "https://novaauth.firebaseio.com",
    projectId: "novaauth",
    storageBucket: "novaauth.appspot.com",
    messagingSenderId: "71780441945"
  };
  firebase.initializeApp(config);

// Option Template
Vue.component('client-patcher', {
  template: `
  <div id="patcher">
  <div class="client-window">
          <div class="nav-btn nav-min"></div>
          <div class="nav-btn nav-close"></div>
      </div>
<span class="patchertip">클라이언트 업데이트 중</span>
<div id="cu-content">
  <div class="cu-process">
      <div id="pval"></div>
      <div id="prem"></div>
  </div>
</div>
</div>
  `
})

function ClientOpen() {  
  bgm.pause();
  clientui.seen = true;
  $('#loginauth').hide();
  $('#login-footer').hide();
  $('#auth-content').show();
  $('.profile-name').html(firebase.auth().currentUser.displayName);
  $(".profile-image").attr("src", firebase.auth().currentUser.photoURL);
  writeUserData();
}

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

loadMessages();

function loadMessages() {
    var callback = function(snap) {
        var data = snap.val();
        console.log(snap.key, data.name, data.text);
    };

    firebase.database().ref('/messages/').limitToLast(12).on('child_added', callback);
    firebase.database().ref('/messages/').limitToLast(12).on('child_changed', callback);
}

// Saves a new message on the Firebase DB.
function saveMessage(messageText) {
  // Add a new message entry to the Firebase Database.
  return firebase.database().ref('/messages/').push({
    name: getUserName(),
    text: messageText,
    profilePicUrl: getProfilePicUrl()
  }).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}



var clientui = new Vue({
    el:'#container',
    data: {
      seen: false,
      loading: true,
      version: '2.0-1006-190308',
      gameStage: 'ALPHA',
      service_status: [],
      server_status: [],
      lobby_header: [{}],
      selected: 'w2',
      options: [
          {res: '1600x900', value: 'w1'},
          {res: '1280x720', value: 'w2'}
      ],
      lang: [
        {lang: '한국어', value: 'kr'},
        {lang: '영어', value: 'en'}
      ]
    },
    beforeMount(){
      this.loading = false;
      this.loginMusicPlay()
      this.loginValidation()
    },
    created() {
      this.server_notification()
      this.serviceStatusData()     
    },
    mounted() {
      axios.get(lobbyHeaderURL).then(response=> {
        this.lobby_header = response.data
      })
      axios.get(serviceStatusURL).then(response=> {
        this.service_status = response.data.notifications
      })
    },
    methods: {
      loginMusicPlay: function(){  
        bgm.play();
        bgm.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
        }, false);
      },
      loginScreenDisable: function() {
        clientui.seen = true;
        bgm.pause();
        alert(firebase.auth().currentUser);
      },
      loginMusicDisable: function(event) {
        if(event.target.checked) {
          bgm.pause();
        }else {
          bgm.play();
        }
      },
      loginValidation: function() {
        var loginArea = document.getElementById("client-email");
        loginArea.onkeypress=function(loginArea) {
          if(this.value.length >= 1) {
          } else {
            document.getElementById('client-login').className('disabled');
          }
        }
      },
      loginBtn: function() {
        loginsound.play();
        var loginfail = new Audio('Plugins/client-login/sounds/client-login-disabled.ogg');
        var emailField = $('#client-email').val();
        var pwdField = $('#client-password').val();
        $("#client-message").html("<p style='color:#d3d3d3;font-weight:bold'>인증중...</p>");
        $('#login-spinner').css('display', 'block');
        $('#client-login').hide();
        $('.login-form').hide();

        firebase.auth().signInWithEmailAndPassword(emailField, pwdField).then(function() {
          $("#client-message").html("<p style='color:#d3d3d3;font-weight:bold'>접속중...</p>");
          setInterval(ClientOpen,8000);
          }).catch(function(error) {
          if(error != null) {
            $('#login-spinner').hide();
            $('.login-form').show();
            $('#client-login').show();
            $("#client-message").html(error.message);
              return;
          }
      });
      },
      serviceStatusData: function() {
        var self = this;
        $.get( serviceStatusURL, function( data ) {  var ssd = JSON.parse(data); self.service_status = ssd.notifications;
        if(ssd.notifications.length == '0') {
          $('div#service-status-icon').css('display','none');
          $('#service-status-messages .status-message a.message-text').css('display','none');
          $('div#service-status-messages').css('display','none');} 
          else {
            $('div#service-status-icon').css('display','block');
            $('#service-status-messages .status-message a.message-text').css('display','block');
          }
        });
        setTimeout(() => { self.serviceStatusData(); }, 20000);
      },
      server_notification:function() {
        var self = this;
      $.get( serviceStatusURL, function( data ) {
          var ssp = JSON.parse(data);
          if(ssp.status == 'offline'){
            document.getElementById("client-login").disabled = true;
            $("#client-login").addClass("client-login-disabled");
            $('#client-message').html('노바 클라이언트가 현재 점검중입니다. 자세한 정보는 상단 서비스 상태를 확인해주시기 바랍니다.');
          } else if(ssp.status == 'online') {
            document.getElementById("client-login").disabled = false;
            $("#client-login").removeClass("client-login-disabled");
            $('#client-message').html('');
          }
      });
      setTimeout(() => { self.server_notification(); }, 5000);
      },
      service_status_btn: function() {
        var x = document.getElementById("service-status-messages");
        if (x.style.display === "none") {
            x.style.display = "block";
            ns.play();
        } else {
            x.style.display = "none";
            nsc.play();
        }
      },
      tick: function(el) {
        TickSound.play();
        $('.nav-item').on('click', function(e) {
          e.preventDefault();
          var src = $(this).attr('href');
          $('iframe').fadeOut(300,function(){
              $('iframe').attr('src',src ).load(function(){
                  $(this).fadeIn(300);    
              });
          });
          $('.nav-item').removeClass('tab-highlight');
          $(this).addClass('tab-highlight');
        });        
        return false;
      },
      play: function() {
        PlaySound.play();
        child(clientPath, function(err, data) {
          if(err){
          console.log('런처가 게임 클라이언트 실행중 오류가 발생했습니다. 게임 클라이언트를 삭제 후 다시 시도해보시기 바랍니다.','클라이언트 오류코드:1');
          return;
          }
          if(success){setTimeout(function() {window.close();}, 2000);}
      console.log(data.toString());
      })
      },
      CheckWindowSize: function() {
      }
    }
  })
