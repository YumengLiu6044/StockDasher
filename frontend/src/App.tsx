import Sidebar from './components/sidebar';
import Topbar from './components/topbar';
import { getStockLogo, getPrice } from './utils/fetch'
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {

  return (
    <div className='min-h-screen flex'>
        <Sidebar></Sidebar>

        <div className='flex flex-col w-full'>
          <Topbar></Topbar>
        </div>
    </div>
  )
}

export default App
