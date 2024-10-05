import './App.css';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import './styles.css';
import Input from './components/Input/Input';
import Button from './components/Button/Button';
import logo from './assets/logo.png'; // Adjust the path based on your directory structure


const socket = io("http://localhost:3001")


const App = () => {
  const [loggedin, setLoggedin] = useState<boolean>(!!localStorage.getItem('username'));
  const [isUserInRoom, setIsUserInRoom] = useState(Boolean(localStorage.getItem('room')));
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');
  const [password, setPassword] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>(localStorage.getItem('room') || '');
  const users = new Map<string, string>();

  useEffect(() => {
    console.log(isUserInRoom);
    if (roomCode !== '') { joinRoom(); }
  })

  const createRoom = () => {
    const id = uuidv4();
    socket.emit("id", id);
    socket.emit("room", id);
    localStorage.setItem('room', id);
    setRoomCode(id);
    setIsUserInRoom(true);
  }

  const joinRoom = () => {
    socket.emit("room", roomCode);
    localStorage.setItem('room', roomCode);
    setIsUserInRoom(true);
  }

  const createAccount = (username: string, password: string) => {
    if (users.get(username) === undefined) {
      users.set(username, password);
      localStorage.setItem('username', username);
      setUsername(username);
      setLoggedin(true);
    }
  }

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRoomCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(event.target.value);
  };


  return (
    <div className="background">
      {!loggedin ?
      (
      <div className='container'>
        <img src={logo} alt="Logo" className="logo" />
        <h1>Welcome!</h1>
        <Input id='username' value={username} onChange={handleUsername} label='Username'/>
        <Input id='password' value={password} onChange={handlePassword} label='Password' />
        <Button onClick={() => createAccount(username, password)} label='Create Account!' />
      </div>
      ) : (
        <div className='container'>
          <h1>Hey {username}!</h1>
          {!isUserInRoom ?
          (
            <>
              <Button onClick={() => createRoom()} label='Create Room!' />
              <Input id='roomCode' value={roomCode} onChange={handleRoomCode} label='Enter Room Code' />
              <Button onClick={() => joinRoom()} label='Join Room!' />
            </>
          ): (
            <>
              <h1>You are currently in a room! {roomCode} - {isUserInRoom}</h1>
              <p>Copy Room Code</p>
              <p>Send a link for friends to join!</p>
              <Button onClick={() => localStorage.clear()} label='Clear Storage' />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
