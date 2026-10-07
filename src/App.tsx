import { useEffect, type ComponentType } from "react";
import { Router, Route, Switch, Redirect, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { StoreProvider, useStore } from "@/lib/store";
import { KidLayout, FamilyLayout } from "@/components/Shell";
import { Toasts } from "@/components/ui";

import Splash from "@/pages/Splash";
import Onboarding from "@/pages/Onboarding";
import Diagnostico from "@/pages/Diagnostico";
import Inicio from "@/pages/Inicio";
import Biblioteca from "@/pages/Biblioteca";
import Lector from "@/pages/Lector";
import Leer from "@/pages/Leer";
import Crear from "@/pages/Crear";
import LumiChat from "@/pages/LumiChat";
import Actividades from "@/pages/Actividades";
import Aprendi from "@/pages/Aprendi";
import Perfil from "@/pages/Perfil";
import FamilyGate from "@/pages/familia/Gate";
import Panel from "@/pages/familia/Panel";
import Bienestar from "@/pages/familia/Bienestar";
import ChatFamilia from "@/pages/familia/Chat";
import PerfilFamilia from "@/pages/familia/PerfilFamilia";

function ScrollTop() {
  const [location] = useLocation();
  useEffect(() => window.scrollTo(0, 0), [location]);
  return null;
}

function kid(Page: ComponentType) {
  return function KidRoute() {
    const { state } = useStore();
    if (!state.child) return <Redirect to="/bienvenida" />;
    return (
      <KidLayout>
        <Page />
      </KidLayout>
    );
  };
}

function family(Page: ComponentType) {
  return function FamilyRoute() {
    const { state, familyUnlocked } = useStore();
    if (!state.child) return <Redirect to="/bienvenida" />;
    if (!familyUnlocked) return <FamilyGate />;
    return (
      <FamilyLayout>
        <Page />
      </FamilyLayout>
    );
  };
}


// Se crean una sola vez para que las pantallas no se vuelvan a montar en cada render.
const kidInicio = kid(Inicio);
const kidBiblioteca = kid(Biblioteca);
const kidLeer = kid(Leer);
const kidCrear = kid(Crear);
const kidLumiChat = kid(LumiChat);
const kidActividades = kid(Actividades);
const kidAprendi = kid(Aprendi);
const kidPerfil = kid(Perfil);
const familyPanel = family(Panel);
const familyBienestar = family(Bienestar);
const familyChatFamilia = family(ChatFamilia);
const familyPerfilFamilia = family(PerfilFamilia);

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/bienvenida" component={Onboarding} />
      <Route path="/diagnostico" component={Diagnostico} />
      <Route path="/inicio" component={kidInicio} />
      <Route path="/biblioteca" component={kidBiblioteca} />
      <Route path="/biblioteca/:id" component={Lector} />
      <Route path="/leer" component={kidLeer} />
      <Route path="/crear" component={kidCrear} />
      <Route path="/lumi" component={kidLumiChat} />
      <Route path="/actividades" component={kidActividades} />
      <Route path="/aprendi" component={kidAprendi} />
      <Route path="/perfil" component={kidPerfil} />
      <Route path="/familia" component={familyPanel} />
      <Route path="/familia/bienestar" component={familyBienestar} />
      <Route path="/familia/chat" component={familyChatFamilia} />
      <Route path="/familia/perfil" component={familyPerfilFamilia} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Router hook={useHashLocation}>
        <ScrollTop />
        <Routes />
      </Router>
      <Toasts />
    </StoreProvider>
  );
}
