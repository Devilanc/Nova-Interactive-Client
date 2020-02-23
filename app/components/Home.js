// @flow
import React from 'react';
import './Home.css';
import ClientHeader from '../Plugins/nova-fe-main-experience/components/index.js';
import ClientUpdate from '../Plugins/nova-be-client-update/components/index.js';

export default class Home extends React.Component {
	componentDidMount() {
	//let LauncherIntro = 'https://lolstatic-a.akamaihd.net/frontpage/apps/prod/universe-map/en_US/61d0e6fadd7044bbdacb73ba6fdcc10fa1c31ef0/assets/assets/audio/sfx-trans-intro-01.mp3';
	//  let audio = new Audio(LauncherIntro);
     // audio.play();
	}

  render() {
    return (
      <div className="container" data-tid="container">
          <ClientHeader />
		  <ClientUpdate />
      </div>
    );
  }
}
