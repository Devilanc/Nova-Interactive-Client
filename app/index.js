// @flow
import React from 'react';
import _fs from 'fs';
import _mt from 'mt-files-downloader';
import _os from 'os';
import _path from 'path';
import _extract from 'extract-zip';
import axios from 'axios';
import { execFile } from 'child_process';
import { ipcRenderer, webFrame } from 'electron';
import { ClientSmallPopup } from '../../nova-fe-notification/components/index.js';


import './patcher.css';
import { throws } from 'assert';
const _mt2 = new _mt();

const LatestVersion = '1.1.0';
const LocalVersion = '1.0.2';
//const ClientServer = '';
const LatestServer = 'https://firebasestorage.googleapis.com/v0/b/nova-interactive-game-client.appspot.com/o/NovaClientPatchline.json?alt=media&token=fa6edb91-422f-4681-ab65-6955dcb9869b';
const _UserSettingFile = 'C://Nova Interactive//ClientSettings.json';
//const ClientServer = 'https://klauncher.kr/klauncher_web/www/menual-overview/css/Client.zip';
const ClientInstallPath = 'C://Nova Interactive/Client.zip';
const LatestInstallPath = 'C://Nova Interactive/latest-client.json';
const LatestPath = "C://Nova Interactive//latest-client.json";
const ClientInstallRoot = 'C://Nova Interactive/';

export default class Patcher extends React.Component {
  constructor(props) {
   super(props);
   const LatestVersion = '1.0.2'
   const LocalVersion = '1.0.3'
   
   this.state = {
	  isLatest: false,
    percentage: '',
    remainData: '',
    remainTime: '',
    speed: '',
    patcherText: '게임 실행',
    showPopup: false,
    errorName: '',
    errorExplain: '',
    BGInstallPath: ''
  }
  this.DirectoryCheck = this.DirectoryCheck.bind(this)
  this.ClientDownload = this.ClientDownload.bind(this)
  this.ClientComplete = this.ClientComplete.bind(this)
  this.ReadyForPlay = this.ReadyForPlay.bind(this)
  this.Play = this.Play.bind(this)
  this.fetchButtonData = this.fetchButtonData.bind(this)
  }
	
  DirectoryCheck() {
   let dir = 'C://Nova Interactive/';
   //this.ClientDownload()
if (!_fs.existsSync(dir)){
  _fs.mkdirSync(dir);
}

if (!_fs.existsSync(LatestPath)){
  //this.ClientDownload()
  //this.ReadyForPlay()
} else {
  //this.ReadyForPlay()
  //this.ClientDownload()
}
  }

  latestFileDownload() {

  }
	
  ClientDownload() {
	const _mt3 = _mt2.download(ClientServer, ClientInstallPath)
   _mt3.start();
    this.interval = setInterval(() => 
    this.setState({
     percentage: (_mt3.getStats().total.completed).toFixed(0)+'%',
     remainData: '예상 시간: '+(_mt3.getStats().future.remaining / 1048576).toFixed(1)+'초',
     remainTime: (_mt3.getStats().future.eta).toFixed(0)
   }), 100);
  }
	
  ClientComplete() {
    clearInterval(this.tester)
    this.setState({
      percentage:'',
      remainTime: '',
      patcherText: '게임 실행'
    })
   // const _jsondownload = _mt2.download(LatestServer, LatestInstallPath)
    //_jsondownload.start();
   // _extract(ClientInstallPath, {dir: ClientInstallRoot}, function (err) {
    // })
	 // let ReadySFX = 'https://lolstatic-a.akamaihd.net/frontpage/apps/prod/universe-map/en_US/58c9aeb77ffc8ea44a3d723fd2e0ccc964f3444b/assets/assets/audio/sfx-trans-intro-01.mp3';
	 // let audio = new Audio(ReadySFX);
	 // audio.play()
	  return false;
  }
	
  ReadyForPlay() {
	  this.setState({
		  isLatest:false
	  })
	  let ReadySFX = 'http://event.leagueoflegends.co.kr/project-2016/assets/audio/sfx-easter.mp3';
	  let audio = new Audio(ReadySFX);
	  audio.play()
  }

  fetchButtonData() {
    fetch(_UserSettingFile)
    .then((response) => response.json())
	.then((json) => 
  this.setState({
    BGInstallPath: json.BurningGroundInstallPath
  })
);
  }

  componentDidMount() {
    this.DirectoryCheck()
    //this.ClientDownload()
    this.fetchButtonData()
    this.setState({
		  isLatest:true
	  })
  }

  Play() {
	let PlaySFX = 'http://event.leagueoflegends.co.kr/project-2016/assets/audio/sfx-backspace.mp3';
	//PlaySFX = '../Assets/sfx-client-play.ogg';
    let audio = new Audio(PlaySFX);
    audio.play();
    let executablePath = this.props.launch;
      execFile(executablePath, (error, stdout, stderr) => {
        if(error) {
          ipcRenderer.send('PatcherLog', stdout)
          switch(error.code) {
            case 'ENOENT':
              this.setState({
                showPopup: !this.state.showPopup,
                errorExplain: '클라이언트를 찾을 수 없습니다. 클라이언트가 "C:/Nova Interactive/"에 올바르게 위치하고 있는지 확인해주시기 바랍니다.'
              })
              break;
          }
        }
      }); 
  }

  
  render() {
    let start = (this.state.percentage == 100+'%') ?
    this.ClientComplete() :
    null
  return (
  <div className="patchercontainer" data-tid="container">
    <div className="play" onClick={this.Play}>
      {this.state.showPopup ? <ClientSmallPopup title="클라이언트 실행 오류" description={this.state.errorExplain} closePopup={this.Play.bind(this)} /> : null}
    <div className="play-inside">
    <span className="patcher-text">{this.state.patcherText}</span>
    <div className="progressbar" style={{display: this.state.isLatest ? 'none' : 'none'}}>
     <div className="pvalue" style={{width: this.state.percentage}}>{start}</div>
       <div className="progressIndicator">{this.state.percentage}</div>
    <div className="subIndicator" style={{display: this.state.percentage == '99%' ? 'none' : 'block'}}>{this.state.remainData}</div>
      <div className="clientTooltip" style={{display: 'none'}}>
     클라이언트 업데이트중 | 1/2 <br />예상 시간: {this.state.remainData}</div>
    </div>
    </div>
  </div>
    </div>
    );
  }
}