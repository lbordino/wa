/* NEW */
import { TextInput, Card, Flex, Title, Button} from '@tremor/react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppInfoContext } from '../AppInfoModel';
import API from '../request';
import Header from '../header/Header';
function LoginForm() {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  const api = new API();
  const info = useContext(AppInfoContext);
  const navigator = useNavigate();

  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };
      const res = api.logIn(credentials).then((res) => {
          if (res) {
              info.setUser(res);
              if (res){
                navigator('/')
              }
          }
      });
  };

  return (
    <>
    <Header />
    <div className='h-screen flex flex-col items-center justify-center'>
      <Card  id='card-homepage'>
        <div>
          <Title  className='my-2 text-center' style={{ fontSize: '32px' }}> Login</Title>
        </div>
        <TextInput className="mr-4 my-4" type='email' value={username} onValueChange={setUsername} ></TextInput>
        <TextInput className="mr-4 my-4" type='password' value={password} onValueChange={setPassword}></TextInput>
        <Flex className="m-6" justifyContent='center'>
          <Button onClick={handleSubmit} className='m-4'>Login</Button>
          <Button onClick={()=>{
            navigator('/')
          }} className='m-4'>Back to Home</Button>
        </Flex>
      </Card>
    </div>
    </>

  )
};


export { LoginForm };