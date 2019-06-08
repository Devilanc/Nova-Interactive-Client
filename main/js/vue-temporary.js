//This Code will Discard after 3.0 React Update

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
