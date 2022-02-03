import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import background from '../img/toy-story-room-wallpaper.jpeg';
import del from '../img/delete.png';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendStiker'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY1MDg1NSwiZXhwIjoxOTU5MjI2ODU1fQ.SyqOCZ-ZRayVpaKTuXcXcZWF_A-Ml3aRJrPdjQ_Iols'
const SUPABASE_URL = 'https://xycbvdkjdfzdxwmikqlt.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaEmTempoReal(adicionaMensagem){
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (msgLive)=>{
            adicionaMensagem(msgLive.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const root = useRouter();
    const usuarioLogado = root.query.username;
    const [message, setMessage] = React.useState('');
    const [messageList, setMessageList] = React.useState([]);


    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                //console.log("Dados da consulta: ", data);
                setMessageList(data);
            })
            
            escutaEmTempoReal((novaMensagem)=>{
                //reusar um valor de referência (objeto/array) passsar função para o setState
                setMessageList((valorAtualDaLista)=>{
                    return[
                        novaMensagem,
                        ...valorAtualDaLista,
                    ]
                });
            });
    }, []);

    function handleDeleteMessage(antigoId){
        supabaseClient
            .from('mensagens')
            .delete()
            .match({ id: Number(antigoId) })
            .then(({data, error}) => {
                console.log(error);
            })
            setMessageList((old) => {
            return old.filter(item => item.id !== antigoId);
        });
    }

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            //id: messageList.length,
            de: usuarioLogado,
            texto: novaMensagem,
        };

        supabaseClient
            .from('mensagens')
            .insert([
                //objeto com os mesmo campos do supabase
                mensagem
            ])
            .then(({ data }) => {
                //console.log('Criando uma mensagem: ', data);
            });

        setMessage('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(${background.src})`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={messageList} onDelete={handleDeleteMessage} user={usuarioLogado}/>
                    {/* Lista de mensagens:{messageList.map((mensagem)=>{
                        return(
                            <li key={mensagem.id}>
                                {mensagem.de}: {mensagem.texto}
                            </li>
                        )
                    })} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(e) => {
                                const msg = e.target.value;
                                setMessage(msg);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                //console.log('Recebi o sticker: ', sticker)
                                handleNovaMensagem(':sticker: ' + sticker);
                            }}
                        />
                        <Button
                            iconName='paperPlane'
                            onClick={() => {
                                if (message != '') {
                                    handleNovaMensagem(message);
                                }
                            }}
                            variant='secondary'
                            colorVariant='neutral'

                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    // console.log('MessageList', props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            {((props.user).toLowerCase() == (mensagem.de).toLowerCase()) && <button
                                onClick={() => {
                                    return props.onDelete(mensagem.id);
                                }}
                            ><img src={del.src} width={10}/></button>}
                            <style jsx>{`
                                button {
                                    background: none;
                                    border: none;
                                    border-radius: 2px;
                                    float: right;
                                }
                                button:hover {
                                    background-color: ${appConfig.theme.colors.neutrals[900]};
                                    cursor: pointer;
                                }
                            `}</style>
                        </Box>
                        {/* [Declarativo] */}
                        {/* Condicional: {mensagem.texto.startsWith(':sticker:').toString()} */}
                        {mensagem.texto.startsWith(':sticker:')
                            ? (
                                <Image src={mensagem.texto.replace(':sticker:', '')} 
                                styleSheet={{
                                    height: '7em'
                                }}/>
                            )
                            : (
                                mensagem.texto
                            )}
                        {/* if mensagem de texto possui stickers:
                           mostra a imagem
                        else 
                           mensagem.texto */}
                        {/* {mensagem.texto} */}
                    </Text>
                );
            })}

        </Box>
    )
}