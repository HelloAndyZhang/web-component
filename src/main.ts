import './image-preview'
import './style.css'
const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <uu-imagepreview isOpened="false" ></uu-imagepreview>
`
const urllist =
  'https://otherfiles.uupt.com/ManagementBackStage/Base/2022/202201/ae86b68e6a9b4849ad1d886a3c11c542_big.jpg,https://images.unsplash.com/photo-1624993590528-4ee743c9896e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=1000&q=80'

  document.querySelector('uu-imagepreview')!.setAttribute('images',   `${urllist},${urllist}`)
  document.querySelector('uu-imagepreview')!.setAttribute('isOpened','true')
  setTimeout(()=>{
    document.querySelector('uu-imagepreview')!.setAttribute('images',   `${urllist}`)
  },2000)