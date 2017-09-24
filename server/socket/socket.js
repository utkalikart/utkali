

module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('new connection - '+socket.id);

    socket.on('user_id', function(data) {
      console.log("user_id",data);
      socket.user_id = data.user_id;
      socket.randomUserId = data.randomUserId;
      socket.join(socket.user_id+"-"+socket.randomUserId);
    });

    socket.on('disconnect',function(reason) {
      console.log("disconnect - "+socket.id)
      socket.leave(socket.user_id+"-"+socket.randomUserId);
    })
  });
}
