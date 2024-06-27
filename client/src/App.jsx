import { useContext, useState } from 'react'
import { Flex, Card, Button, Title } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import Header from './header/Header'
import { AppInfoContext } from './AppInfoModel'

function App() {
  const [backgroundImg, setBackgroundImg] = useState("");
  const navigator = useNavigate()
  async function resetBackground() {
    setBackgroundImg('')
  }
  async function generateBackground() {
    const response = await fetch('https://api.imgflip.com/get_memes')
    const data = await response.json()
    const memes = data.data.memes
    const randomMeme = memes[Math.floor(Math.random() * memes.length)]
    setBackgroundImg(randomMeme.url)
  }
  const info = useContext(AppInfoContext);
  
  return (
    <>
    <Header />
    <div style={{ backgroundImage: `url(${backgroundImg})` }} className='h-screen flex flex-col items-center justify-center'>
      <Card  id='card-homepage'>
        <div>
          <Title  className='my-2 text-center' style={{ fontSize: '32px' }}> Welcome to Meme Game!</Title>
          <Title className='my-2 text-center' style={{ fontSize: '24px' }}> Get ready to laugh!</Title>
        </div>
        <Flex justifyContent='center'>
          <Button onClick={generateBackground} className='m-4'>Generate Background</Button>
          <Button onClick={()=> {
            navigator('/console')
          }} className='m-4'>Play Game</Button>
          <Button onClick={resetBackground} className='m-4'>Reset Background</Button>
        </Flex>
      </Card>
    </div>
    </>
  )
}

export default App
