const getters = {
  isLogin: state => state.user.isLogin,
  userName: state => state.user.nickname,
  avatarUrl: state => state.user.avatarUrl,
  virUid: state => state.user.virUid,
  registrationDate: state => state.user.registrationDate,
  myApps: state => state.app.appList,
  appVersion: state => state.app.version,
};

export default getters;
