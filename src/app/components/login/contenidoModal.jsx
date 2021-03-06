import React, { Fragment, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebaseconfig'
import './login.css';
import useLocalStorage from "../hooks/useLocalStorage";

import {
    GlobalStyles,
    Head,
    Text,
    Input,
    Form,
    Container,
    FormContainer,
    Button,
    OverlayContainer,
    OverlayPanel,
    Overlay
} from "./index.style.js";



function ContenidoModal() {
    const [panelActive, setPanelActive] = useState(false);
    const [loginActive, setLoginActive] = useState(false);
    const [emailLogin, setEmailLogin] = useLocalStorage("nologin", "emailLogin");
    const [regEmail, setRegEmail] = useState("");
    const [regPass, setRegPass] = useState("");
    const [logEmail, setLogEmail] = useState("");
    const [logPass, setLogPass] = useState("");
    const [user, setUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    const onSignInEvent = () => {
        setPanelActive(false);
    };

    const onSignUpEvent = () => {
        setPanelActive(true);
    };

    const registrarUsuario = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, regEmail, regPass);
            console.log(user)
            await setEmailLogin(user.user.email)
            setLoginActive(true);
            console.log(user.user.email)
            if ((user.user.email === "josegcort@gmail.com") || (user.user.email === "wset.1o1@gmail.com")) {
                window.location.replace("#/admin/servicio");
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    const iniciarUsuario = async (e) => {
        try {
            const user = await signInWithEmailAndPassword(auth, logEmail, logPass);
            console.log(user)
            await setEmailLogin(user.user.email)
            setLoginActive(true);
            console.log(user.user.email)
            if ((user.user.email === "josegcort@gmail.com") || (user.user.email === "wset.1o1@gmail.com")) {
                window.location.replace("#/admin/servicio");
            }
        } catch (error) {
            console.log(error.message);
            console.log(loginActive + " ")
        }
    };
    const echarUsuario = async () => {
        await signOut(auth);
        setLoginActive(false);
        await setEmailLogin("nologin")
    };
    return (
        <Fragment>
            <GlobalStyles />
            <Container
                id="container"
                className={`${panelActive ? "right-panel-active" : ""}`}
            >
                <FormContainer className="sign-up-container">
                    <Form action="#">
                        <Head className="title">Crear una cuenta</Head>

                        <Input type="text" placeholder="Nombre" />
                        <Input
                            onChange={(e) => { setRegEmail(e.target.value) }}
                            type="email"
                            placeholder="Correo electr??nico"
                        />
                        <Input
                            onChange={(e) => { setRegPass(e.target.value) }}
                            type="password"
                            placeholder="Contrase??a"
                        />
                        <Button onClick={registrarUsuario}>Registrarse</Button>
                    </Form>
                </FormContainer>
                <FormContainer className="sign-in-container">

                    {
                        !loginActive ?
                            <Form action="#">
                                <Head className="title">Iniciar Sesi??n</Head>
                                <Input
                                    onChange={(e) => { setLogEmail(e.target.value) }}
                                    className="input-login"
                                    type="text"
                                    placeholder="Correo electr??nico"
                                />
                                <Input
                                    onChange={(e) => { setLogPass(e.target.value) }}
                                    type="password"
                                    placeholder="Contrase??a"
                                />
                                <Button onClick={iniciarUsuario}>Iniciar Sesi??n</Button>

                            </Form>

                            :
                            <Form action="#">
                                <Button className="espacio" onClick={echarUsuario}>Cerrar Sesi??n</Button>
                            </Form>
                    }
                </FormContainer>
                <OverlayContainer>
                    <Overlay>
                        <OverlayPanel className="overlay-left">
                            <Head>Bienvenido de nuevo! {user?.email}</Head>
                            <Text>
                                Para mantenerse conectado con nosotros, inicie sesi??n con su informaci??n personal
                            </Text>
                            <Button className="ghost" id="signIn" onClick={onSignInEvent}>
                                Iniciar sesi??n
                            </Button>
                        </OverlayPanel>
                        <OverlayPanel className="overlay-right">
                            <Head>Hola! {user?.email}</Head>
                            <Text>Ingrese sus datos personales y comience su viaje con nosotros</Text>
                            <Button className="ghost" id="signUp" onClick={onSignUpEvent}>
                                Registrarse
                            </Button>
                        </OverlayPanel>
                    </Overlay>
                </OverlayContainer>
            </Container>
        </Fragment>
    );
}

export default ContenidoModal;