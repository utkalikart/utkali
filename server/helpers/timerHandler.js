var schedule = module.exports = require('node-schedule');

function setTestTimer(io,id,time) {
  var date = getPreviousTime(time*60);//add seconds to current time
  var j = schedule.scheduleJob(id, date, function() {
    console.log("expire"+id);
    io.sockets.to(id).emit('Timeout',{msg:'submit your answer'});
    clearTestTimer(id);
  });
}

function clearTestTimer(id) {
  var my_job = schedule.scheduledJobs[id];
  if(typeof my_job != "undefined" && my_job != null)
    my_job.cancel();
}

function getPreviousTime(t) {
  //t will be in second how many seconds you want to go forward or backword in time.
  var ut = new Date();
  ut.setSeconds(ut.getSeconds() + Number(t));
  return ut;
}

module.exports = {
  setTestTimer : setTestTimer,
  clearTestTimer : clearTestTimer
};
