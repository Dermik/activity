
		(() => {
			io.connect();
			if (typeof console !== 'undefined') {
				console.log('Connecting to sails...');
			}
			io.socket.on('connect', () => {
				console.log('conected');
				io.socket.on('user', cometMessageRecievdFromServer);
				io.socket.get('/user/subscribe', (resData) => {
					console.log(resData); // => {id:9, name: 'Timmy Mendez'}
				});
				// socket.get('/user/subscribe');
				// socket.emit('/user/subscribe');
				// $.ajax({
				//   url: "/user/subscribe",
				//   success: function(data){
				//     alert( "Прибыли данные: " + data );
				//   }
				// });
			});
		})();

		const cometMessageRecievdFromServer = (mess) => {
			const userId = mess.id;
			console.log('new message is :', mess);
			// updateUserInDom(userId, mess);
		};
