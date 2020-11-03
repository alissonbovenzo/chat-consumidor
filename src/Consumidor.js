
import 'stream-chat-react/dist/css/index.css';
import { Chat, Channel, ChannelHeader, Window, MessageCommerce, TypingIndicator} from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import Button from './Button'
import jwt from 'jsonwebtoken';
import React from 'react'
import './Consumidor.css'
const chatClient = new StreamChat('fxsf5wmvu8vd');


const url_data = window.location.search.split('?')[1].split('&')
const params = url_data.map((value)=>{return value.split('=')} )
const object_params = params.map((value)=>{
  const key_name = value[0]
  const dale = value[1]
  const data = {
    [key_name] : decodeURI(dale)
  }
  return data
})
const parsed_params = {...object_params[0], ...object_params[1],  ...object_params[2],  ...object_params[3]}


const payload = {
  user_id : ''.concat(parsed_params['stand']).concat('-').concat( parsed_params['name'].replaceAll(' ', '_'))
}

const privateKey = 'u6f66muw7geee8ptvsmkmw2axet6gzkze785hsxmdsr674t74qmgsqru73mfa2ju'
const token = jwt.sign(payload, privateKey, { algorithm: 'HS256'});

chatClient.setUser(
  {
       id: payload['user_id'],
       name: parsed_params['name'],
  },
  token,
);


const ConsumidorScreen = ()=>{

  const [open, setOpen] = React.useState(true)

  const [channel, setChannel] = React.useState(undefined)

  const [membersAtendees, setMembersAtendees] = React.useState([])
  const userConfig = {
    image: parsed_params['logo'] || 'https://picsum.photos/seed/picsum/100/100',
    name: parsed_params['stand'],
    stand: parsed_params['stand'],
    members:membersAtendees
  }

  React.useEffect(()=>{

    if(!membersAtendees.length){
      getAtendees()
    }
  },[])


  React.useEffect(()=>{
    console.log('agora tem atendentes')
  },[membersAtendees])

  const getAtendees = async() =>{

    const members = await chatClient.queryUsers({atendee:true, stand: parsed_params['stand']})
    console.log(members)
    const users_ids = members.users.map((user)=> user.id)
    console.log(users_ids)
    setMembersAtendees(users_ids)
    
  }

  const toggle = () => {
    setOpen(!open)
    const _channel = chatClient.channel('messaging', ''.concat(payload['user_id']).concat(parsed_params['stand']), userConfig)
    setChannel(_channel)
  }

  if(!membersAtendees.length) {
    return <React.Fragment />
  }else {
    const channel = chatClient.channel('messaging', ''.concat(payload['user_id']).concat(parsed_params['stand']), userConfig)
  return (
    <div className={'wrapper--open'} style={{'display': 'flex'}}>
      <Chat client={chatClient} theme={'commerce dark'}>
        <Channel channel={channel} >
          <Window>
            <ChannelHeader title={parsed_params['stand']} />
              <MessageList
                typingIndicator={TypingIndicator}
                Message={MessageCommerce}
               />
            <MessageInput  />
          </Window>
        </Channel>
      </Chat>
      {/* <Button onClick={toggle} open={open} /> */}
    </div>
  );
}

}
export default ConsumidorScreen
