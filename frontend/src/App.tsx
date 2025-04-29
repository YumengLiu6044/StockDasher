import { searchStock } from './utils/fetch'


function App() {

  return (
    <>
        <button className='rounded-md p-2' onClick={() => {
          searchStock("AAPL", (data: any) => {})
        }}>Click me</button>
    </>
  )
}

export default App
