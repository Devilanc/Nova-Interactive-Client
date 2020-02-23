import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes';
import App from './containers/App';
//import HomePage from './containers/HomePage';
import HomePage from './components/Home';
import Inside from './Plugins/nova-fe-inside/components/index.js';
import LatestNotes from './Plugins/nova-fe-latest-notes/components/index.js';
import Overview from './Plugins/nova-fe-overview/components/index.js';
import PlayerGuide from './Plugins/nova-fe-player-guide/components/index.js';
import Qna from './Plugins/nova-fe-launcher-qna/components/index.js';
import Unit from './Plugins/nova-fe-player-guide/components/unit.js';
import Building from './Plugins/nova-fe-player-guide/components/bldg.js';
import SpecUnit from './Plugins/nova-fe-player-guide/components/spec-unit.js';
import Techtree from './Plugins/nova-fe-player-guide/components/techtree.js'

export default () => (
  <App>
    <HomePage />
    <Switch>
      <Route path={routes.GUIDE} component={PlayerGuide} />
      <Route path={routes.OVERVIEW} component={Overview} />
      <Route path={routes.INSIDE} component={Inside} />
      <Route path={routes.UPDATENOTES} component={LatestNotes} />
	  <Route path={routes.Qna} component={Qna} />
	  <Redirect to="/overview" />
    </Switch>
	<Switch>
	  <Route path={routes.UNITS} component={Unit} />
	  <Route path={routes.BLDGS} component={Building} />
	  <Route path={routes.SUNIT} component={SpecUnit} />
	  <Route path={routes.techtree} component={Techtree} />
    </Switch>
  </App>
);
