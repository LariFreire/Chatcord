import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import appConfig from '../config.json';
import {useRouter} from 'next/router';
import React from 'react';
import {useState, useEffect } from 'react';
import defaultImage from '../img/jessie.png';
import background from '../img/toy-story-room-wallpaper.jpeg';
import { SiGithub } from 'react-icons/si';

function Titulo(props){
    const Tag = props.tag || "h1";
    return(
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
            ${Tag} {
                color: ${appConfig.theme.colors.neutrals['000']};
                font-size: 24px;
                font-weight: 600;
            }
            `}</style>
        </>
    );
}

// function HomePage() {
//     return (
//         <div>
//             <GlobalStyle />
//             <Titulo tag="h2">Boas vindas de volta!</Titulo>
//             <h2>Discord - Matrix</h2>
//         </div>
//     )  
// }

// export default HomePage

export default function PaginaInicial() {
//const username = 'LariFreire';
const [username, setUsername] = useState('');
const user = username.length > 2 ? username : '';
const [name, setName] = useState('');
const root = useRouter();

useEffect (()=>{
    user ? fetch(`https://api.github.com/users/${user}`).then(response => response.json()).then(data => setName(data.name)) : setName('');
},[username])

return (
    <>
        <Box
            styleSheet={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: `url(${background.src})`,
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
            }}
        >
        <Box
        styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
            xs: 'column',
            sm: 'row',
            },
            width: '100%', maxWidth: '700px',
            borderRadius: '5px', padding: '32px', margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700],
        }}
        >
        {/* Formulário */}
        <Box
            as="form"
            onSubmit={function(e){
                e.preventDefault();
                //if(validUser)
                    root.push(`/chat?username=${user}`);
                //else
                //    alert('Nome de usuário inválido!')
                //window.location.href = '/chat';
            }}
            styleSheet={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
        >
        <Titulo tag="h2">Boas vindas de volta!</Titulo>
        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
        {appConfig.name}
        </Text>
        {/* <input
            type="text"
            value={username}
            onChange={function handler(event){
                //Onde tá o valor?
                const valor = event.target.value;
                //Trocar o valor da veriável
                setUsername (valor);

            }}
        ></input> */}
        <TextField
            placeholder='Insira o user do GitHub'
            value={username}
            onChange={function handler(event){
                //Onde tá o valor?
                const valor = event.target.value;
                //Trocar o valor da veriável
                setUsername (valor);
                user ? fetch(`https://api.github.com/users/${user}`).then(response => response.json()).then(data => setName(data.name)) : setName('');

            }}
        fullWidth
        textFieldColors={{
            neutral: {
            textColor: appConfig.theme.colors.neutrals[200],
            mainColor: appConfig.theme.colors.neutrals[900],
            mainColorHighlight: appConfig.theme.colors.primary[500],
            backgroundColor: appConfig.theme.colors.neutrals[800],
            },
        }}
        /> 
        <Button
        type='submit'
        label='Entrar'
        fullWidth
        buttonColors={{
            contrastColor: appConfig.theme.colors.neutrals["000"],
            mainColor: appConfig.theme.colors.primary[500],
            mainColorLight: appConfig.theme.colors.primary[400],
            mainColorStrong: appConfig.theme.colors.primary[600],
        }}
        disabled={user ? false : true}
        />
        </Box>
        {/* Formulário */}


        {/* Photo Area */}
        <Box
            styleSheet={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '200px',
            padding: '16px',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            border: '1px solid',
            borderColor: appConfig.theme.colors.primary[500],
            borderRadius: '10px',
            flex: 1,
            minHeight: '240px',
            }}
        >
            <Image
            styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
            }}
            src={user ? `https://github.com/${user}.png` : defaultImage.src}
            />
            <Text
            variant="body4"
            styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
            }}
            >
            
            {!user ? '. . .' : name ? name : user}
            </Text>
        </Box>
        {/* Photo Area */}
        </Box>
    </Box>
    </>
);
}  