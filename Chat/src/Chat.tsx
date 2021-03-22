import React, { SyntheticEvent, useEffect, useState } from 'react';
import io from 'socket.io-client';
import uuid from 'uuid';

interface IMessage {
  id: string;
  message: string;
}


const Chat: React.FC = () => {

  const [message, updateMessage] = useState<string>('');
  const [messages, updateMessages] = useState<IMessage[]>([]);

  const [myId, setMyID] = useState(uuid.v4());
  const socket = io('http://localhost:8080');
  socket.on('connect', () => console.log('[IO] Connect => A new connection has been established'));

  useEffect(() => {
    const handleNewMessage = (newMessage: IMessage) => updateMessages([...messages, newMessage]);
    socket.on('chat.message', handleNewMessage);
    return () => {
      socket.off('chat.message', handleNewMessage);
    };
  }, [messages]);


  const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit('chat.message', {
        id: myId,
        message
      });
      updateMessage('');
      console.log(myId);
    }
  }

  const handleInputChange = (event: { target: { value: string; }; }) => updateMessage(event.target.value);


  return (
    <main>
      <ul>
        {messages.map((message, i) => (
          <li key={i} className={`${message.id === myId ? 'list__item--mine' : 'list__item--other'}`}>{message.message}</li>
        ))}
      </ul>
      <form className="form" onSubmit={handleFormSubmit}>
        <input
          className="form__field"
          onChange={handleInputChange}
          placeholder="Type a new message here and press Enter to send"
          type="text"
          value={message}
        />
      </form>
    </main>
  );
}

export default Chat;