import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyBc72alOt_10_jddC3Bqx-jUYROUyr0YAg',
  authDomain: 'mtga-collection-tracker.firebaseapp.com',
  databaseURL: 'https://mtga-collection-tracker.firebaseio.com',
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;
